const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/authenticateUser');

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
       cb(null, 'public/avatars');
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

const uploadAvatarRouter = express.Router();


uploadAvatarRouter.post('/', auth.verifyUser,upload.single('image'),async (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
})



module.exports = uploadAvatarRouter;
