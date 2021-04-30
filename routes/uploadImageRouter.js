const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/autenticateSeller');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, 'public/images');
   },
   
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
}

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadImageRouter = express.Router();


uploadImageRouter.post('/', auth.verifySeller,upload.single('image'),async (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})



module.exports = uploadImageRouter;
