const SubscriptionController = require('../controller/subscription.controller')
const router = require("express").Router();
const { verifyToken } = require("../controller/verifyToken");
require('dotenv').config();

router.post('/subscribe', (req,res)=>{
    SubscriptionController.subscribe(req.body).then(result=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})
router.get('/getSubscriptedProjectByIdStudent/:id', (req,res)=>{
    SubscriptionController.getSubscriptedProjectByIdStudent(req.params.id).then(result=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})
router.get('/getSubscriptedStudentsByIdProject/:id',verifyToken, (req,res)=>{
    SubscriptionController.getSubscriptedStudentsByIdProject(req.params.id).then(result=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})
module.exports = router;