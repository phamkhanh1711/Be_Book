module.exports = app =>{
    var router = require('express').Router();
    const controller = require('../controllers/Register.controller')
    router.get('/',(req,res)=>{
        res.render('introduction.ejs')
    })

    router.get('/success',controller.getAll)
    app.use(router);

    router.get('/home',(req,res)=>{
        res.render('home.ejs')
    })
    app.use(router);
}