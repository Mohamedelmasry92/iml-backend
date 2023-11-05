const express = require('express');
const {body} = require('express-validator')

const router = express.Router();

const multer = require('multer')

const courseTopicController = require('../controllers/courseTopicController')
const {validationSchemaCourseTopics} = require('../middlewares/validationSchemaCourseTopics')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
    destination: function (req , file , cb) {
        // console.log("File : ----> " , file)
        cb(null , 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        // const fileName = `user-${Date.now()}.${ext}`
        const fileName = `courseTopic-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`

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

const cpUpload = upload.fields([{ name: 'categoryImage', maxCount: 1 }])


router.route('/')
            .get(verifyToken, allowedTo(userRoles.ADMIN , userRoles.MANAGER),courseTopicController.getAllCourseTopics)
            .post(verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER),cpUpload,validationSchemaCourseTopics(),courseTopicController.addCourseTopic)


router.route('/:courseTopicId')
            .get(verifyToken,allowedTo(userRoles.ADMIN , userRoles.MANAGER) , courseTopicController.getCourseTopicById)
            .patch(verifyToken , allowedTo(userRoles.ADMIN , userRoles.MANAGER) ,cpUpload, validationSchemaCourseTopics(),courseTopicController.updateCourseTopic)
            .delete(verifyToken , upload.none() , allowedTo(userRoles.ADMIN , userRoles.MANAGER) , courseTopicController.deleteCourseTopic)


module.exports = router;