module.exports = app => {
    require('./vintage.router')(app);

    require('./auth.router')(app);

    require('./member.router')(app);

    require('./vnpay.router')(app)
}