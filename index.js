require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors')
const compression = require('compression')

const app = express();

const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText')

const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("mongodb server connected");
})



app.use(cors())
app.use(compression())

app.use('/uploads' , express.static(path.join(__dirname , 'uploads')))


//only one url can access on our backend api
/* var corsOptions = {
    origin: 'http://example.com',
    optionsSuccessStatus: 200


    app.use(cors(corsOptions)) --> to run this code -- this origin only can access on our api 

}*/

app.use(express.json());

require('./controllers/articlecontroller')
require('./middlewares/asyncWrapper')
const articleRouter = require('./routes/articlerouter')
const articleTopicRouter = require('./routes/articleTopicRouter')
const userRouter = require('./routes/userrouter')
const courseRouter = require('./routes/courserouter')
const courseTopicRouter = require('./routes/courseTopicRouter')
const instructorController = require('./routes/instructorrouter')
const quizRouter = require('./routes/quizrouter')

app.use('/api/articles' , articleRouter)
app.use('/api/articleTopics' , articleTopicRouter)
app.use('/api/users' , userRouter)
app.use('/api/courses' , courseRouter)
app.use('/api/courseTopics' , courseTopicRouter)
app.use('/api/instructor' , instructorController)
app.use('/api/quiz' , quizRouter)

//global middleware for not found routers
app.all('*' , (req , res , next) =>{
    return res.status(404).json({status : httpStatusText.ERROR , message : "this resource is not available" })
})

//global middleware error handler
app.use( (error , req , res , next) => {
    res.status(error.statusCode || 500).json({status : error.statusText || httpStatusText.ERROR , message : error.message , code : error.statusCode || 500 , data : null});
})



app.listen(process.env.PORT || 5001 , ()=>{
    console.log("Listening on port 5000")
})