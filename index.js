const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép frontend gọi API

// Thay thông tin theo máy của mày
const dbConfig = {
  user: 'webuser1', // hoặc user mày dùng
  password: '123456',
  server: 'DESKTOP-B6AKE4M', // hoặc IP máy chủ
  database: 'shoesstore',
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

sql.connect(dbConfig)
  .then(pool => {
    console.log('✅ Kết nối SQL Server thành công!');

    app.post('/register', async (req, res) => {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        await pool.request()
          .input('username', sql.NVarChar, username)
          .input('password', sql.NVarChar, hashedPassword)
          .query('INSERT INTO users (email, password) VALUES (@username, @password)');

        res.send('Đăng ký thành công!');
      } catch (err) {
        console.error(err);
        res.status(500).send('Đăng ký thất bại!');
      }
    });

    app.listen(3000, () => console.log('🚀 Server đang chạy ở http://localhost:3000'));
  })
  .catch(err => console.error('❌ Kết nối DB thất bại:', err));
