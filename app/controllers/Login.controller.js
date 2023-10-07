const User = require('../models/auth/auth.model');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.showLoginForm = (req, res) => {
    res.render('auth/login');
}

exports.login = (req, res) => {
    const { email, password, role_id } = req.body;
  
    if (email && password && role_id) {
      User.findByEmail(email, role_id, (err, user) => {
        if (!user) {
          res.status(401).json({ error: 'User not found' });
        } else {
          if (password == user.password) {
            // Tạo token
            const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
  
            // Tạo auth object
            const auth = {
              id: user.id,
              username: user.username, // Thêm username vào auth object
              email: user.email,
              password: user.password, // Thêm password vào auth object
              role_id: user.role_id,
              // Thêm thông tin khác của người dùng nếu cần
            };
  
            req.session.loggedin = true;
            req.session.user = auth;
  
            console.log(auth); // Log thông tin người dùng vào console
  
            res.json({ success: true, message: 'Login successful', token, auth });
          } else {
            res.status(401).json({ error: 'Invalid password' });
          }
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  };
  
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.redirect('/500');
        res.redirect('/');
    })
}

exports.list_account = (req, res) => {
    User.getAll_Account((data) => {
        res.json({ result: data });
    });
}