const Member = require('../../models/member/member.model');

const jwt = require('jsonwebtoken');

exports.addNewInfor = (req, res) => {
    const newData = {
        fullName: req.body.fullName,
        address: req.body.address,
        phone_number: req.body.phone_number,
        birth_date: req.body.birth_date,
        gender: req.body.gender,
        avatar: req.file ? req.file.filename : null
    }
    console.log(newData.avatar);
    Member.addInfor(newData, (err) => {
        if (err) {
            console.log(err);
            res.json({ error: 'An error occurred while adding' });
        } else {
            console.log('User added to the database');
            const uploadedImagePath = req.file ? `/public/upload/${req.file.filename}` : null;
            res.status(200).json({ message: 'Adding successfully', avatar: uploadedImagePath });
        }
    })
}



exports.detailUser = (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, authData) => {
        if (err) {
            res.json({
                message: "Invalid Token..." + err.message
            });
        } else {
            const id = authData.account_id;
            console.log(id);
            Member.getUserById(id, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else if (!data) {
                    res.status(404).json({ error: 'User not found' });
                } else {
                    res.status(200).json({ detail: data });
                }
            });
        }
    })
};
