const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../controller/verifyToken");
const UserController = require("../controller/User.controller");
const router = require("express").Router();
const multer = require('multer')
const storage = require('../storageConfig');
var upload = multer({storage})


router.post('/addUser',verifyTokenAndAdmin,upload.single('file'),(req,res)=>{
    req.body.photo = (req.file) ? req.file.filename : "profile-image.png"
    UserController.newUser(req.body).then((result)=> res.status(200).json(result)).catch((err)=>res.status(500).json(err))
}
)
router.put('/upDateUser/:id',verifyTokenAndAdmin, upload.single('file'),(req,res)=>{
    if(req.file) req.body.photo = req.file.filename
    UserController.upDateUser(req.body,req.params.id).then((result)=> res.status(200).json(result)).catch((err)=>res.status(500).json(err))
}
)

router.get('/findUser/:id',verifyToken , (req,res)=>{
    UserController.findUserById(req.params.id).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})
router.get('/getAllTeachers',verifyToken , (req,res)=>{
    const query = req.query.new;
    UserController.getAllTeacher(query).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})
router.get('/getAllStudent',verifyToken , (req,res)=>{
    const query = req.query.new;
    UserController.getAllStudent(query).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.delete('/deleteStudent/:id',verifyToken , (req,res)=>{
    UserController.deleteStudent(req.params.id).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.delete('/deleteTeacher/:id',verifyToken , (req,res)=>{
    UserController.deleteTeacher(req.params.id).then((result)=>res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

module.exports = router;