const User = require('../../models/auth/auth.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

exports.create = (req, res) => {
    res.render('auth/register');
}

exports.getAll = (req, res) => {
    User.getAll_Account((data) => {
        return res.json({ dataUser: data });

    })
}


// login
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
                                username: user.username,
                                email: user.email,
                                role_id: user.role_id
                            },
                            process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict', expires: new Date(Number(new Date()) + 30 * 60 * 1000) })

                        res.json({ success: true, message: 'Login successful', jsontoken });
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
    res.json({ message: 'Logout successful' });

}

exports.list_account = (req, res) => {
    User.getAll_Account((data) => {
        res.json({ result: data });
    });
}

// register
exports.register = (req, res) => {
    const { username, email, password, role_id } = req.body;
    const parsedRoleId = parseInt(role_id);

    if (username && email && password && role_id) {
        User.findByEmail(email, (err, user) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: err });
                }

                User.createUser({ username, email, password: hashedPassword, role_id: parsedRoleId }, (err, newUser) => {
                    if (err) {
                        return res.status(500).json({ message: err });
                    }

                    // Tạo JWT token sau khi đăng ký thành công
                    const jsontoken = jwt.sign(
                        {
                            username: newUser.username,
                            email: newUser.email,
                            role_id: newUser.role_id
                        },
                        process.env.JWT_SECRET_KEY, { expiresIn: '1h' }
                    );
                    //them token vào cookie
                    res.cookie('token', jsontoken, {
                        httpOnly: true,
                        secure: true,
                        SameSite: 'strict',
                        expires: new Date(Number(new Date()) + 30 * 60 * 1000)
                    })
                    // Trả về dữ liệu của người dùng đã đăng ký và JWT trong JSON response
                    return res.status(201).json({ user: newUser, jsontoken });
                });
            });
        });
    } else {
        return res.status(400).json({ message: 'Invalid input data' });
    }
};