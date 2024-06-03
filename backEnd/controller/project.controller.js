const Project = require('../model/Project') ;
const Subscription = require('../model/subscription')
const mongoose = require('mongoose')

exports.CreateProject = (body)=>{
    return new Promise(async(resolve, reject)=>{
        body.skillsProject = JSON.parse(body.skillsProject)
        const newProduct = new Project({
            img: body.photo,
            desc:body.desc,
            title:body.title,
            endAt:body.endAt,
            skillsProject: body.skillsProject,
            teacher : body.teacher
        });
        // const currDate = new Date('DD/MM/YYYY');
    const endDate = new Date(body.endAt); //YYYY-mm-dd
    const currDate = new Date();
    // currDate.setHours(0, 0, 0, 0);
    try {
        if (endDate > currDate) {
            const savedProject = await newProduct.save();
            resolve(savedProject)
        }
        else {
            reject({msg:"End date must be greater than date now!!"})
        }
    } catch (error) {
        reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard", err:error})
    }
    })
}

exports.getProjectById = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const project = await Project.findById(id).populate('teacher', 'firstname lastname').
            then((project) => {
                resolve(project)
            }).catch((err)=>{
                reject({msg:"impossible d'obtenir les données", err:err})
            });
        } catch (error) {
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard!!", err:err})
        }
    })
}

exports.getProjectByTeacherId = (id)=>{
    return new Promise((resolve,reject)=>{
        Project.find({ teacher : id })
        .populate('teacher', 'firstname lastname photo')
        .then((projects) => {
            resolve(projects)
        })
        .catch((err) => {
            console.error(err);
            reject({msg:"Une erreur s'est produite lors de la récupération des projets avec le nom du propriétaire", err:err})
        });
    })
}

exports.getAllProject = ()=>{
    return new Promise((resolve,reject)=>{
        Project.find({})
    .populate('teacher', 'firstname lastname')
    .then((projects) => {
        resolve(projects)
    })
    .catch((err) => {
        console.error(err);
        reject({err:err})
    });
    })
}

exports.updateProject = (id, body)=>{
    return new Promise(async (resolve,reject)=>{
        body.skillsProject = JSON.parse(body.skillsProject)
        // req.body.img =  (req.file) ? req.file.filename : req.body.img
        try {
            const updatedProject = await Project.findByIdAndUpdate(
                id,
                { $set:body },
                { new: true });
                resolve(updatedProject)
        } catch (error) {
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard", err:error})
        }
    })
}

// exports.deleteProject 
exports.deleteProject = (projectId)=>{
    return new Promise(async(resolve,reject)=>{
        const session = await mongoose.startSession();
        try{
            await Subscription.deleteMany({ projectId:projectId }, { session });
            await Project.deleteOne({ _id: projectId }, { session });
            resolve("projet supprimé avec succès")
        }catch(err){
        
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard",err:err})
        }finally {
            session.endSession();
        }
    })
}
