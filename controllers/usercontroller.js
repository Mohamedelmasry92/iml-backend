const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require('../models/usermodel');
const appError = require("../utils/appError");
const httpStatusText = require('../utils/httpStatusText')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT')
// const oneDeletePhoto = require('../middlewares/onePhotoToDelete');
const { validationResult } = require("express-validator");



const getAllUsers = asyncWrapper(
    async (req , res ) =>{
            const query = req.query;
            const limit = query.limit || 100;
            const page = query.page || 1;
            const skip = (page - 1) * limit;
            const users = await User.find({} , {"__v" : false , "password" : false}).limit(limit).skip(skip); // may you can make some changes on find method
            res.json({status : httpStatusText.SUCCESS , data : {users}});
    }
)

const getUserById = asyncWrapper(
     async (req , res , next) =>{
                 const user = await User.findById(req.params.userId);
                 if(!user){
                     const error = appError.create('user not found' , 404 , httpStatusText.FAIL)
                     return next(error)
                     // return res.status(404).json({status : httpStatusText.FAIL , data : {user : "user not found"}})
                 }
                 return res.json({status : httpStatusText.SUCCESS , data : {user}});
             // try {
             // } catch (err){
             // return res.status(400).json({status : httpStatusText.ERROR , data : null , message : err.message , code : 400 })
             // }
     }
)

const register = asyncWrapper(
    async (req , res , next) =>{
           const {fName , lName , email , password , phone , address , gender , role , createdAt} = req.body

           const oldUser = await User.findOne({email : email})
           if(oldUser){
                const error = appError.create('user is already exists' , 400 , httpStatusText.FAIL)
                return next(error)
           }
           //password hashing
           const hashedPassword = await bcrypt.hash(password , 10)

           const newUser = new User({
                fName, 
                lName, 
                email,  
                password: hashedPassword,
                phone, 
                address, 
                gender,
                role,
                // avatar : req.files['avatar'][0].filename,
                createdAt
           })

           // generate jwt token
           const token = await generateJWT({email : newUser.email , id: newUser._id , role: newUser.role});
           newUser.token = token;

            await newUser.save();
    
            res.status(201).json({status : httpStatusText.SUCCESS , data : {user: newUser}})
    }
)

const login = asyncWrapper(
    async (req , res , next) =>{
           const { email , password } = req.body

           if(!email){
                const error = appError.create('email is required' , 400 , httpStatusText.FAIL)
                return next(error)
            }

           if(!password){
                const error = appError.create('password is required' , 400 , httpStatusText.FAIL)
                return next(error)
            }

           if(!email && !password){
                const error = appError.create('email and password are required' , 400 , httpStatusText.FAIL)
                return next(error)
           }

           const user = await User.findOne({email : email});

           if(!user){
                const error = appError.create('user not found' , 400 , httpStatusText.FAIL)
                return next(error)
           }

           const matchedPassword = await bcrypt.compare(password , user.password);

           if(!matchedPassword){
                const error = appError.create('Email or Password .. one of them is wrong' , 400 , httpStatusText.FAIL)
                return next(error)
            }

           if(user && matchedPassword) {
               const token = await generateJWT({email : user.email , id: user._id , role: user.role});
                res.status(201).json({status : httpStatusText.SUCCESS , data : {token : token}})
           }else {
                const error = appError.create('something wrong' , 500 , httpStatusText.FAIL)
                return next(error)
           }
           
    }
)

const deleteUser = asyncWrapper(
     async (req , res ,next) =>{
         
         const userId = req.params.userId;
         const validateUser = await User.findById(userId)
         
         if(!validateUser){
             const error = appError.create('user not found' , 404 , httpStatusText.FAIL)
             return next(error)
             
         }else{
 
            //  const reqDeleted = validateUser
            //  const folderPath = 'uploads';
            //  const photoToDelete = reqDeleted.avatar;    
             
            //  const deletionphoto = oneDeletePhoto(folderPath, photoToDelete);
 
             await User.deleteOne({_id: userId})
             return res.status(200).json({status : httpStatusText.SUCCESS , data : "user deleted Successfully"});
 
         }
     }
)

const updateUser =  asyncWrapper( async (req , res , next) =>{
     try {
     
         const {fName , lName , email , password , phone , address , gender , role , createdAt} = req.body

 
         const userId = req.params.userId;
         const validateUser = await User.findById(userId)
         
         const paramsUpdated = req.body
         // console.log(paramsUpdated)
         if(!validateUser){
             const error = appError.create('user not found' , 404 , httpStatusText.FAIL)
             return next(error)
         }else{

               const oldUser = await User.findOne({email : email})
               if(oldUser == true && (validateUser !== userId)){
                    const error = appError.create('user is already exists' , 400 , httpStatusText.FAIL)
                    return next(error)
               }

            //    const reqDeleted = validateUser
            //    const folderPath = 'uploads';
            //    const photoToDelete = reqDeleted.avatar;
            //    oneDeletePhoto(folderPath, photoToDelete);    

               const errors = validationResult(req);
               if(!errors.isEmpty()){
                   const error = appError.create(errors.array() , 400 , httpStatusText.FAIL)
                   return next(error)
                   // return res.status(400).json({status : httpStatusText.FAIL , data : {errors: }})
               }   

               //password hashing
               const hashedPassword = await bcrypt.hash(password , 10)
 
                 const updatedUser = await User.updateOne({_id: userId} , 
                    {fName, 
                     lName, 
                     email,  
                     password: hashedPassword,
                     phone, 
                     address, 
                     gender,
                     role,
                     createdAt,
                    //  avatar : req.files['avatar'][0].filename,
                 })
 
                 const token = await generateJWT({email : updatedUser.email , id: updatedUser._id , role: updatedUser.role});
                 updatedUser.token = token;

                 // await updatedUser.save();  
 
                 return res.status(200).json({status : httpStatusText.SUCCESS , data : {user: updatedUser}})
             }
         }catch(error){
             return next(error)
         }
 
     }
 )



module.exports = {
    getAllUsers,
    register,
    login,
    updateUser,
    deleteUser,
    getUserById
}