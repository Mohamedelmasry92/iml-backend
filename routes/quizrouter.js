const express = require('express');
const {body} = require('express-validator')

const router = express.Router();

const quizController = require('../controllers/quizcontroller')
const verifyToken = require('../middlewares/verifyToken')
const allowedTo = require('../middlewares/allowedTo')
const userRoles = require('../utils/userRoles');


router.route('/')
            .get(quizController.getAllQuiz)
            .post(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),quizController.addQuiz)


router.route('/:quizId')
            .get(quizController.getQuizById)
            .patch(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),quizController.updateQuiz)
            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),quizController.deleteQuiz)


module.exports = router;