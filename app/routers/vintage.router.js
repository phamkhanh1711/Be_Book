module.exports = app =>{
    var router = require('express').Router();
    const controller = require('../controllers/Book_controler')
    const middleware = require('../middleware/auth.middleware');
    
    var appRoot = require('app-root-path')
    const multer = require('multer')
    const path = require('path')

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, appRoot + "/public/upload");
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname); // Sử dụng tên gốc của tệp
        },
      });

    const imageFilter = function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only image files are allowed!';
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    let upload = multer({ storage: storage });
    // fileFilter: imageFilter

    router.get('/',(req,res)=>{
        res.render('introduction.ejs')
    })

    router.get('/home',(req,res)=>{
        res.render('home.ejs')
    })

      router.get('/form_add_book', controller.showDataCategory)
        .post('/add_book', upload.fields([{ name: 'fileElem' }, { name: 'myImage' }]), controller.createNewBook)

    router.get('/book', controller.ShowBook)
    .get('/detail_book/:id',  controller.detailBooK)
    .get('/category/:id', controller.categoryBook)
    .get('/all_category', controller.All_CataCategory)
    .get('/all_supplier', controller.All_supplier)
    .get('/search', controller.searchProduct);
    app.use(router);
}