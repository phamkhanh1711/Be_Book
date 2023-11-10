

module.exports = app => {
    var router = require('express').Router();
    const controller = require('../controllers/member/member.controller')
    const upload = require('../upload.muler')
    const middleware = require('../middleware/auth.middleware')
    router.get('/member/formadd', middleware.authMember, controller.detailUser)
        .post('/member/add_infomation',   upload.single('avatar'), controller.addNewInfor)

    app.use(router)
}