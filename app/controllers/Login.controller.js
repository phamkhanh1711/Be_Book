const User = require('../models/auth/auth.model');
const jwt = require('jsonwebtoken');

exports.showLoginForm = (req, res) => {
    res.render('auth/login');
}

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        User.findByEmail(email, (err, user) => {
            if (!user) {
                res.status(401).json({ error: 'User not found' });
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // Đăng nhập thành công - tạo và trả về JWT token
                        const jsontoken = jwt.sign(
                            {
                                account_id: user.account_id,
                                username: user.username,
                                email: user.email,
                                role_id: user.role_id
                            },
                            process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict', expires: new Date(Number(new Date()) + 30 * 60 * 1000) })

                        res.json({
                            success: true, message: 'Login successful', jsontoken,
                            User: user
                        });
                    } else {
                        res.status(401).json({ error: 'Invalid password' });
                    }
                });
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