const jwt = require('jsonwebtoken');
require('dotenv/config');
const cookieParser = require('cookie-parser');
// exports.authAdmin = (req, res, next) => {
//     const token = req.cookies.token;

//     if (token === undefined) {
//         return res.status(401).json({ message: "Access Denied! Unauthorized User" });
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
//         if (err) {
//             res.status(401).json({ message: "Invalid Token..." + err.message });
//         } else {
//             const role_id = authData.role_id;
//             if (role_id === 1) {
//                 next(); // Cho phép Admin truy cập
//             } else {
//                 res.status(401).json({ message: "You are not an Admin" });
//             }
//         }
//     });
// }

exports.authMember = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (token === undefined) {
        return res.status(401).json({ message: "Access Denied! Unauthorized User" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.status(401).json({ message: "Invalid Token..." + err.message });
        } else {
            const role_id = authData.role_id;
            if (role_id === 2 || role_id === 1) {
                next(); // Cho phép User và Admin truy cập
            } else {
                res.status(401).json({ message: "You need login" });
            }
        }
    });
}