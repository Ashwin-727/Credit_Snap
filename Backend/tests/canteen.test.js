const request = require('supertest');
const app = require('../app');
const setup = require('./setup');
const User = require('../models/userModel');
const Canteen = require('../models/canteenModel');
const MenuItem = require('../models/menuItemModel');
const jwt = require('jsonwebtoken');

// Setup environment variable for test
process.env.JWT_SECRET = 'test-secret-key-that-is-long-enough-for-jwt-signing';

let ownerToken;
let ownerUser;
let testCanteen;

beforeAll(async () => {
  await setup.connect();
  
  // Create an owner user
  ownerUser = await User.create({
    name: 'Test Owner',
    email: 'owner@test.com',
    password: 'password123',
    role: 'owner',
    phoneNo: '1234567890',
    isVerified: true
  });

  // Generate JWT for the owner
  ownerToken = jwt.sign({ id: ownerUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Create a canteen for the owner
  testCanteen = await Canteen.create({
    name: 'Test Canteen',
    ownerId: ownerUser._id,
    timings: '4:00 PM - 4:00 AM',
    isOpen: false
  });
});

afterEach(async () => {
  // Clear menu items after each test to ensure a clean slate for menu testing
  await MenuItem.deleteMany({});
});

afterAll(async () => {
  await setup.closeDatabase();
});

describe('Canteen & Menu API Tests', () => {

  describe('GET /api/canteens', () => {
    it('should return a list of canteens', async () => {
      const res = await request(app).get('/api/canteens');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.canteens)).toBe(true);
      expect(res.body.data.canteens.length).toBeGreaterThan(0);
      expect(res.body.data.canteens[0].name).toBe('Test Canteen');
      expect(res.body.data.canteens[0].status).toBe('Closed'); // Initial value
    });
  });

  describe('PUT /api/canteens/:id/status', () => {
    it('should update the operational status of the canteen (Open -> Closed)', async () => {
      const res = await request(app)
        .put(`/api/canteens/${testCanteen._id}/status`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ isOpen: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.canteen.isOpen).toBe(true);
      
      // Verify DB change
      const updated = await Canteen.findById(testCanteen._id);
      expect(updated.isOpen).toBe(true);
    });

    it('should fail if unauthorized', async () => {
      const res = await request(app)
        .put(`/api/canteens/${testCanteen._id}/status`)
        .send({ isOpen: true });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/canteens/:id/menu', () => {
    it('should add a new item to the menu', async () => {
      const res = await request(app)
        .post(`/api/canteens/${testCanteen._id}/menu`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Burger',
          price: 50,
          category: 'Fast Food',
          veg: true,
          isAvailable: true
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.menuItem.name).toBe('Burger');
      expect(res.body.data.menuItem.price).toBe(50);
    });

    it('should prevent adding duplicate menu items', async () => {
      // Add first item
      await request(app)
        .post(`/api/canteens/${testCanteen._id}/menu`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Pizza',
          price: 100,
          category: 'Fast Food'
        });

      // Try adding it again
      const res = await request(app)
        .post(`/api/canteens/${testCanteen._id}/menu`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'pizza', // Testing regex matching ignorecase
          price: 150,
          category: 'Fast Food'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('PUT /api/canteens/menu/:itemId', () => {
    let menuItem;

    beforeEach(async () => {
      // Create a menu item before testing PUT
      menuItem = await MenuItem.create({
        name: 'Pasta',
        price: 80,
        category: 'Fast Food',
        canteenId: testCanteen._id
      });
    });

    it('should update an existing menu item', async () => {
      const res = await request(app)
        .put(`/api/canteens/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ price: 90, isAvailable: false });

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.menuItem.price).toBe(90);
      expect(res.body.data.menuItem.isAvailable).toBe(false);
    });
  });

  describe('DELETE /api/canteens/menu/:itemId', () => {
    let menuItem;

    beforeEach(async () => {
      // Create a menu item before testing DELETE
      menuItem = await MenuItem.create({
        name: 'Fries',
        price: 40,
        category: 'Fast Food',
        canteenId: testCanteen._id
      });
    });

    it('should delete an existing menu item', async () => {
      const res = await request(app)
        .delete(`/api/canteens/menu/${menuItem._id}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.statusCode).toEqual(204); // No content
      
      const checkItem = await MenuItem.findById(menuItem._id);
      expect(checkItem).toBeNull();
    });
  });

});