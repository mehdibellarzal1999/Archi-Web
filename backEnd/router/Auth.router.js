const authController = require("../controller/Auth.controller");
const {verifyToken} = require('../controller/verifyToken')
const router = require("express").Router();
require('dotenv').config();

router.post('/login',(req,res)=>{
    authController.login(req.body).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.post('/regester',(req,res)=>{
    authController.regester(req.body).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.post('/sendCodeToEmail',(req,res)=>{
    authController.sendCodeToEmail(req.body).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.post('/changePassword',(req,res)=>{
    authController.changePassword(req.body).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.get('/verifyToken',verifyToken,(req,res)=>{
    res.status(200).json("valid token")
})

module.exports = router;