const { verifyToken} = require("../controller/verifyToken");
const ProjectController = require("../controller/project.controller");
const router = require("express").Router();
const multer = require('multer')
const storage = require('../storageConfig');
var upload = multer({storage})

router.post('/create', verifyToken , upload.single('file') ,(req,res)=>{
    req.body.photo = (req.file) ? req.file.filename : "profile-image.png"
    ProjectController.CreateProject(req.body).then((result)=> res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

router.post('/update/:id',verifyToken , upload.single('file'),(req,res)=>{

     req.body.img =  (req.file) ? req.file.filename : req.body.img
    ProjectController.updateProject(req.params.id,req.body).then((result)=> res.status(200).json(result)).catch((err)=>res.status(200).json(err))
})

router.get('/getAllProject',verifyToken , (req,res)=>{
    ProjectController.getAllProject().then((result)=> res.status(200).json(result)).catch((err)=>res.status(200).json(err))
})

router.get('/getProjectByTeacherId/:id',verifyToken , (req,res)=>{
    ProjectController.getProjectByTeacherId(req.params.id).then((result)=> res.status(200).json(result)).catch((err)=>res.status(200).json(err))
})

router.get('/getProjectById/:id',verifyToken,(req,res)=>{
    ProjectController.getProjectById(req.params.id).then((result)=> res.status(200).json(result)).catch((err)=>res.status(200).json(err))
})
router.delete('/delete/:id',verifyToken,(req,res)=>{
    ProjectController.deleteProject(req.params.id).then((result)=> res.status(200).json(result)).catch((err)=>res.status(500).json(err))
})

module.exports = router;

// craete teacher 
// create 3 project
// create 2 student 
// add skills 
// add skills to student
// get all project 
// subscript to projects
// delete project 
// delete student 
// delete teacher 