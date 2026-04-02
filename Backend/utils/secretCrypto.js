const crypto = require('crypto');

const getEncryptionKey = () => {
  const secret = process.env.RAZORPAY_CONFIG_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Set RAZORPAY_CONFIG_SECRET (or JWT_SECRET) before saving payment credentials.');
  }

  return crypto.createHash('sha256').update(secret).digest();
};

exports.encryptValue = (value) => {
  if (!value) {
    return '';
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
};

exports.decryptValue = (encryptedValue) => {
  if (!encryptedValue) {
    return '';
  }

  const [ivBase64, authTagBase64, cipherBase64] = encryptedValue.split(':');

  if (!ivBase64 || !authTagBase64 || !cipherBase64) {
    throw new Error('Stored payment credential format is invalid.');
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivBase64, 'base64')
  );

  decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(cipherBase64, 'base64')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
};
