const User = require('../models/auth/auth.model')
require('dotenv/config');

exports.create = (req, res) => {
    res.render('auth/register');
}

exports.getAll = (req,res)=>{
    User.getAll_Account((data) =>{
        return res.render('success', { dataUser: data });

    })
}
exports.register = (req, res) => {
    const { username, email, password, role_id } = req.body;
   

    if (username && email && password && role_id) {
        User.findByEmail(email, (err, user) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            User.createUser({ username, email, password, role_id}, (err, newUser) => {
                if (err) {
                    console.error("Error creating user:", err);
                    return res.status(500).json({ message: "Internal Server Error" });
                }

                // Trả về dữ liệu của người dùng đã đăng ký trong JSON response
                return res.status(200).json({ message: "Đăng ký thành công" });
            });
        });
    } else {
        return res.status(400).json({ message: 'Invalid input data' });
    }
};



