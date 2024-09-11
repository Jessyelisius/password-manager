const crypto = require('crypto');

// Define algorithm, key, and IV
const algorithm = 'aes-256-cbc';


// Function to encrypt password
function encryptPassword(password) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // 32 bytes key for AES-256
    const iv = crypto.randomBytes(16); // 16 bytes IV

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'), // Convert IV to hex string for storage
        key: key.toString('hex'), // Convert key to hex string for storage
        encryptedData: encrypted
    };
}




// Decrypt function
// Function to decrypt password
function decryptPassword(encryptedData, key, iv) {
    const algorithm = 'aes-256-cbc';

    // Convert key and IV back to buffers before decryption
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

module.exports = {
    encryptPassword,
    decryptPassword
}