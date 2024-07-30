const connection = require('../config/database');
const crypto = require('crypto');


// Hàm tạo xâu ngẫu nhiên
const generateRandomString = (length, chars) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Hàm băm mật khẩu
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Hàm để tạo dữ liệu giả
const generateUsers = (numUsers) => {
    let users = [];
    const usernameChars = 'abcdefghijklmnopqrstuvwxyz';
    const passwordChars = '0123456789';
    for (let i = 0; i < numUsers; i++) {
        const username = generateRandomString(6, usernameChars);
        const password = hashPassword(generateRandomString(6, passwordChars));
        users.push([username, password, 0, null]);
    }
    return users;
};

// Chèn người dùng vào bảng users theo từng lô nhỏ
const insertUsers = (batchSize = 10000) => {
    const totalUsers = 1000000;
    const users = generateUsers(totalUsers);
    const insertQuery = 'INSERT IGNORE INTO users (username, password, loggedIn, loggedAt) VALUES ?';

    const insertBatch = (startIndex) => {
        if (startIndex >= totalUsers) {
            console.log('Inserted all users');
            return;
        }

        const endIndex = Math.min(startIndex + batchSize, totalUsers);
        const batch = users.slice(startIndex, endIndex);

        connection.query(insertQuery, [batch], (err, results) => {
            if (err) {
                console.error('Error inserting users:', err);
                return;
            }
            console.log(`Inserted users ${startIndex + 1} to ${endIndex}`);
            insertBatch(endIndex);
        });
    };

    insertBatch(0);
};
// Gọi hàm chèn người dùng

// Tạo bảng users nếu chưa tồn tại
const createTableUsers = () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      userId INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(256) NOT NULL UNIQUE,
      password VARCHAR(256) NOT NULL,
      loggedIn SMALLINT DEFAULT 0,
      loggedAt DATETIME DEFAULT NULL
    )
  `;

    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
            return;
        }
        console.log('Table "users" created or already exists');
    });

}


module.exports = {
    createTableUsers,
    hashPassword,
    createTableUsers,
    insertUsers
}