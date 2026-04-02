const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const Module = require('node:module');

function withPopulate(record) {
  return Object.assign(record, {
    populate() {
      return this;
    }
  });
}

function withSelect(record) {
  return Object.assign(record, {
    select() {
      return this;
    }
  });
}

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

function createIoRecorder() {
  const events = [];

  return {
    events,
    io: {
      to(room) {
        return {
          emit(event, payload) {
            events.push({ room, event, payload });
          }
        };
      }
    }
  };
}

function stubModule(specifier, exportsValue) {
  const resolved = require.resolve(specifier);
  const previous = require.cache[resolved];
  const stub = new Module(resolved);

  stub.filename = resolved;
  stub.loaded = true;
  stub.exports = exportsValue;
  require.cache[resolved] = stub;

  return () => {
    if (previous) {
      require.cache[resolved] = previous;
      return;
    }

    delete require.cache[resolved];
  };
}

function loadPaymentController({
  Canteen = {},
  Debt = {},
  Payment = {},
  settleDebtPayment = async () => ({}),
  Razorpay = class {}
} = {}) {
  const restoreFns = [
    stubModule('../models/canteenModel', Canteen),
    stubModule('../models/debtModel', Debt),
    stubModule('../models/paymentModel', Payment),
    stubModule('../utils/debtPayments', { settleDebtPayment }),
    stubModule('razorpay', Razorpay)
  ];

  const controllerPath = require.resolve('../controllers/paymentController');
  delete require.cache[controllerPath];

  const controller = require('../controllers/paymentController');

  return {
    controller,
    restore() {
      delete require.cache[controllerPath];

      while (restoreFns.length > 0) {
        restoreFns.pop()();
      }
    }
  };
}

test('createDebtOrder creates a Razorpay order and local payment record', async () => {
  let razorpayOptions;
  let orderPayload;
  let paymentPayload;

  const debtRecord = withPopulate({
    _id: 'debt_12345678',
    amountOwed: 250.75,
    student: { _id: 'student_1' },
    canteen: {
      _id: 'canteen_1',
      name: 'Campus Cafe',
      razorpayMerchantKeyId: 'rzp_test_merchant123',
      getRazorpayMerchantKeySecret: () => 'merchant-secret'
    }
  });

  const { controller, restore } = loadPaymentController({
    Debt: {
      findById(id) {
        assert.equal(id, 'debt_12345678');
        return debtRecord;
      }
    },
    Payment: {
      async create(payload) {
        paymentPayload = payload;
        return { _id: 'payment_local_1' };
      }
    },
    Razorpay: class FakeRazorpay {
      constructor(options) {
        razorpayOptions = options;
        this.orders = {
          create: async (payload) => {
            orderPayload = payload;
            return { id: 'order_rzp_1', amount: payload.amount, currency: payload.currency };
          }
        };
      }
    }
  });

  try {
    const req = {
      params: { debtId: 'debt_12345678' },
      body: { amount: 125.5 },
      user: {
        role: 'student',
        _id: 'student_1',
        name: 'Ada',
        email: 'ada@example.com',
        phoneNo: '9999999999'
      }
    };
    const res = createResponse();

    await controller.createDebtOrder(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.status, 'success');
    assert.deepEqual(razorpayOptions, {
      key_id: 'rzp_test_merchant123',
      key_secret: 'merchant-secret'
    });
    assert.equal(orderPayload.amount, 12550);
    assert.equal(orderPayload.currency, 'INR');
    assert.deepEqual(orderPayload.notes, {
      debtId: 'debt_12345678',
      studentId: 'student_1',
      canteenId: 'canteen_1',
      purpose: 'debt_payment'
    });
    assert.equal(paymentPayload.amount, 125.5);
    assert.equal(paymentPayload.providerOrderId, 'order_rzp_1');
    assert.equal(paymentPayload.providerKeyId, 'rzp_test_merchant123');
    assert.equal(paymentPayload.receipt, orderPayload.receipt);
    assert.match(paymentPayload.receipt, /^debt_\d+_12345678$/);
    assert.deepEqual(res.body.data, {
      paymentRecordId: 'payment_local_1',
      keyId: 'rzp_test_merchant123',
      orderId: 'order_rzp_1',
      amount: 12550,
      currency: 'INR',
      merchantName: 'Campus Cafe',
      description: 'Debt payment for Campus Cafe',
      prefill: {
        name: 'Ada',
        email: 'ada@example.com',
        contact: '9999999999'
      }
    });
  } finally {
    restore();
  }
});

test('createDebtOrder rejects amounts larger than the current debt', async () => {
  let paymentCreateCalled = false;
  let razorpayConstructed = false;

  const debtRecord = withPopulate({
    _id: 'debt_12345678',
    amountOwed: 120,
    student: { _id: 'student_1' },
    canteen: {
      _id: 'canteen_1',
      name: 'Campus Cafe',
      razorpayMerchantKeyId: 'rzp_test_merchant123',
      getRazorpayMerchantKeySecret: () => 'merchant-secret'
    }
  });

  const { controller, restore } = loadPaymentController({
    Debt: {
      findById() {
        return debtRecord;
      }
    },
    Payment: {
      async create() {
        paymentCreateCalled = true;
      }
    },
    Razorpay: class FakeRazorpay {
      constructor() {
        razorpayConstructed = true;
      }
    }
  });

  try {
    const req = {
      params: { debtId: 'debt_12345678' },
      body: { amount: 150 },
      user: { role: 'student', _id: 'student_1' }
    };
    const res = createResponse();

    await controller.createDebtOrder(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      status: 'fail',
      message: 'Amount exceeds current debt! The maximum payment is ₹120.'
    });
    assert.equal(paymentCreateCalled, false);
    assert.equal(razorpayConstructed, false);
  } finally {
    restore();
  }
});

test('verifyDebtPayment rejects invalid Razorpay signatures and marks the payment failed', async () => {
  let saveCalls = 0;
  let razorpayConstructed = false;

  const claimedPayment = {
    _id: 'payment_1',
    canteen: 'canteen_1',
    debt: 'debt_1',
    amount: 150,
    status: 'processing',
    failureReason: '',
    async save() {
      saveCalls += 1;
    }
  };

  const { controller, restore } = loadPaymentController({
    Payment: {
      async findById(id) {
        assert.equal(id, 'payment_1');
        return {
          _id: 'payment_1',
          student: 'student_1',
          status: 'created',
          providerOrderId: 'order_1'
        };
      },
      async findOneAndUpdate(query, update) {
        assert.deepEqual(query, { _id: 'payment_1', status: 'created' });
        assert.equal(update.$set.status, 'processing');
        assert.equal(update.$set.providerPaymentId, 'pay_1');
        assert.equal(update.$set.providerSignature, 'bad-signature');
        return claimedPayment;
      }
    },
    Canteen: {
      findById(id) {
        assert.equal(id, 'canteen_1');
        return withSelect({
          _id: 'canteen_1',
          name: 'Campus Cafe',
          razorpayMerchantKeyId: 'rzp_test_merchant123',
          getRazorpayMerchantKeySecret: () => 'merchant-secret'
        });
      }
    },
    Razorpay: class FakeRazorpay {
      constructor() {
        razorpayConstructed = true;
      }
    }
  });

  try {
    const req = {
      body: {
        paymentRecordId: 'payment_1',
        razorpay_order_id: 'order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'bad-signature'
      },
      user: {
        role: 'student',
        _id: 'student_1'
      }
    };
    const res = createResponse();

    await controller.verifyDebtPayment(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      status: 'fail',
      message: 'Invalid Razorpay signature.'
    });
    assert.equal(claimedPayment.status, 'failed');
    assert.equal(claimedPayment.failureReason, 'Invalid Razorpay signature.');
    assert.equal(saveCalls, 1);
    assert.equal(razorpayConstructed, false);
  } finally {
    restore();
  }
});

test('verifyDebtPayment captures authorized payments, settles debt, and emits live updates', async () => {
  let saveCalls = 0;
  let settleArgs;
  let fetchedPaymentId;
  let captureArgs;

  const { io, events } = createIoRecorder();
  const signature = crypto
    .createHmac('sha256', 'merchant-secret')
    .update('order_1|pay_1')
    .digest('hex');

  const claimedPayment = {
    _id: 'payment_1',
    canteen: 'canteen_1',
    debt: 'debt_1',
    amount: 230,
    status: 'processing',
    failureReason: 'stale-error',
    async save() {
      saveCalls += 1;
    }
  };

  const debtRecord = withPopulate({
    _id: 'debt_1',
    canteen: 'canteen_1',
    student: {
      _id: 'student_1',
      name: 'Ada'
    }
  });

  const settlement = {
    canteenDebt: 70,
    studentTotalDebt: 70
  };

  const { controller, restore } = loadPaymentController({
    Payment: {
      async findById(id) {
        assert.equal(id, 'payment_1');
        return {
          _id: 'payment_1',
          student: 'student_1',
          status: 'created',
          providerOrderId: 'order_1'
        };
      },
      async findOneAndUpdate(query, update) {
        assert.deepEqual(query, { _id: 'payment_1', status: 'created' });
        assert.equal(update.$set.status, 'processing');
        assert.equal(update.$set.providerPaymentId, 'pay_1');
        assert.equal(update.$set.providerSignature, signature);
        return claimedPayment;
      }
    },
    Canteen: {
      findById(id) {
        assert.equal(id, 'canteen_1');
        return withSelect({
          _id: 'canteen_1',
          name: 'Campus Cafe',
          razorpayMerchantKeyId: 'rzp_test_merchant123',
          getRazorpayMerchantKeySecret: () => 'merchant-secret'
        });
      }
    },
    Debt: {
      findById(id) {
        assert.equal(id, 'debt_1');
        return debtRecord;
      }
    },
    settleDebtPayment: async (args) => {
      settleArgs = args;
      return settlement;
    },
    Razorpay: class FakeRazorpay {
      constructor(options) {
        assert.deepEqual(options, {
          key_id: 'rzp_test_merchant123',
          key_secret: 'merchant-secret'
        });
        this.payments = {
          fetch: async (paymentId) => {
            fetchedPaymentId = paymentId;
            return { status: 'authorized', amount: 23000, currency: 'INR' };
          },
          capture: async (...args) => {
            captureArgs = args;
            return { status: 'captured', amount: 23000, currency: 'INR' };
          }
        };
      }
    }
  });

  try {
    const req = {
      body: {
        paymentRecordId: 'payment_1',
        razorpay_order_id: 'order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: signature
      },
      user: {
        role: 'student',
        _id: 'student_1'
      },
      app: {
        get(key) {
          return key === 'io' ? io : undefined;
        }
      }
    };
    const res = createResponse();

    await controller.verifyDebtPayment(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      status: 'success',
      message: 'Successfully paid ₹230.',
      data: settlement
    });
    assert.equal(fetchedPaymentId, 'pay_1');
    assert.deepEqual(captureArgs, ['pay_1', 23000, 'INR']);
    assert.deepEqual(settleArgs, {
      debt: debtRecord,
      amountPaid: 230,
      receiptLabel: 'Online Debt Payment'
    });
    assert.equal(claimedPayment.status, 'paid');
    assert.equal(claimedPayment.failureReason, '');
    assert.ok(claimedPayment.settledAt instanceof Date);
    assert.equal(saveCalls, 1);
    assert.deepEqual(
      events.map(({ room, event }) => ({ room, event })),
      [
        { room: 'student:student_1', event: 'debt-updated' },
        { room: 'student:student_1', event: 'payment-successful' },
        { room: 'canteen:canteen_1', event: 'debt-updated' },
        { room: 'canteen:canteen_1', event: 'payment-received' }
      ]
    );
    assert.deepEqual(events[1].payload, {
      amount: 230,
      canteenName: 'Campus Cafe'
    });
    assert.deepEqual(events[3].payload, {
      studentName: 'Ada',
      amount: 230,
      canteenName: 'Campus Cafe'
    });
  } finally {
    restore();
  }
});
