const express = require('express');
const {body} = require('express-validator')

const router = express.Router();

const appError = require('../utils/appError')

const multer = require('multer')

const instructorController = require('../controllers/instructorcontroller')
const {validationSchemaInstructor} = require('../middlewares/validationSchemaInstructor')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles');


const diskStorage = multer.diskStorage({
    destination: function (req , file , cb) {
        // console.log("File : ----> " , file)
        cb(null , 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        // const fileName = `user-${Date.now()}.${ext}`
        const fileName = `inst-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`

        cb(null, fileName)
    }
})

const fileFilter = (req , file , cb) => {
    const imageType = file.mimetype.split('/')[0]
    if(imageType == 'image'){
        return cb(null , true)
    }else{
        return cb(appError.create('File must be an image' , 400 ) , false)
    }
}

const upload = multer({ 
    storage: diskStorage,
    fileFilter: fileFilter
})

const cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }]) 
// : 
// appError == true ? 
// upload.none()


router.route('/')
            .get(instructorController.getAllInstructors)
            .post( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , cpUpload , validationSchemaInstructor()   , instructorController.addInstructor)


router.route('/:instructorId')
            .get(instructorController.getInstructorById)
            .patch( verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , cpUpload, validationSchemaInstructor() , instructorController.updateInstructor)
            .delete( verifyToken , upload.none() , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , instructorController.deleteInstructor)


module.exports = router;