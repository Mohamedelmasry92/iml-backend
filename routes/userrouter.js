
const express = require('express');

const router = express.Router();

// const multer = require('multer')

const validatePassword = require("../middlewares/validatepassword")
const userController = require('../controllers/usercontroller')
const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require("../middlewares/allowedTo");
const {validationSchemaUser} = require("../middlewares/validationSchemaUser");
const appError = require("../utils/appError");
const userRoles = require('../utils/userRoles');

// const diskStorage = multer.diskStorage({
//     destination: function (req , file , cb) {
//         // console.log("File : ----> " , file)
//         cb(null , 'uploads')
//     },
//     filename: function (req, file, cb) {
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `user-${Date.now()}${Math.round(Math.random() * 1E9)}.${ext}`
//         cb(null, fileName)
//     }
// })

// const fileFilter = (req , file , cb) => {
//     const imageType = file.mimetype.split('/')[0]
//     if(imageType == 'image'){
//         return cb(null , true)
//     }else{
//         return cb(appError.create('File must be an image' , 400 ) , false)
//     }
// }

// const upload = multer({ 
//     storage: diskStorage,
//     fileFilter: fileFilter
// })

// const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])


router.route('/').get( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER), userController.getAllUsers)

router.route('/register').post( validatePassword, validationSchemaUser(),  userController.register)

router.route('/login').post( userController.login)

router.route('/:userId')
            .get( verifyToken , allowedTo(userRoles.ADMIN , userRoles.USER , userRoles.MANAGER), userController.getUserById)
            .patch( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER ,userRoles.USER) , validationSchemaUser(), userController.updateUser)
            .delete( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER,userRoles.USER) , userController.deleteUser)


module.exports = router;
