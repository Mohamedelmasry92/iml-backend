const express = require('express');
const {body} = require('express-validator')

const router = express.Router();

const appError = require('../utils/appError')

const multer = require('multer')

const coursesController = require('../controllers/coursecontroller')
const {validationSchemaCourse} = require('../middlewares/validationSchemaCourse')
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
        const fileName = `course-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`

        cb(null, fileName)
    }
})

const fileFilter = (req , file , cb) => {
    // console.log(file)
    if(file.fieldname == "coverImage"){
        const imageType = file.mimetype.split('/')[0]
        if(imageType == 'image'){
            return cb(null , true)
        }else{
            return cb(appError.create('File must be an image' , 400 ) , false)
        }
    }else if(file.fieldname == "videoIntro" || file.fieldname == "urlVideos" ){
        const videoType = file.mimetype.split('/')[0]
        if(videoType == 'video'){
            return cb(null , true)
        }else{
            return cb(appError.create('File must be an video' , 400 ) , false)
        }
    }else{
        return cb(appError.create('can not upload this file try again' , 400 ) , false)
    }
}

const upload = multer({ 
    storage: diskStorage,
    fileFilter: fileFilter
})

const cpUpload = upload.fields([{ name: 'coverImage', maxCount: 1 },{ name: 'videoIntro', maxCount: 1 }, { name: 'urlVideos', maxCount: 8 }])


router.route('/')
            .get(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursesController.getAllCourses)
            .post(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),cpUpload,validationSchemaCourse(), coursesController.addCourse)


router.route('/:courseId')
            .get(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursesController.getCourseById)
            .patch(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),cpUpload, validationSchemaCourse(),coursesController.updateCourse)
            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursesController.deleteCourse)


module.exports = router;