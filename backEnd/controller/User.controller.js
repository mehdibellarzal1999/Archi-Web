const User = require('../model/User.model');
const Project = require('../model/Project');
const Subscription = require('../model/subscription')
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config();

const shimaRegester = Joi.object({
    firstname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    lastname: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().min(8),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})


exports.newUser = (body) => {
    return new Promise((resolve, reject) => {
        var { firstname, lastname, password, email, role, photo } = body;
        var validation = shimaRegester.validate({ firstname: firstname, lastname: lastname, email: email, password: password });
        if (validation.error) {
            reject({ msg: validation.error.details[0].message });
        } else {
            bcrypt.hash(process.env.DefaultPaaswordUser, 10).then(async (hashpassword) => {
                const newUser = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashpassword,
                    role: role,
                    photo: photo
                });
                try {
                    // check if email user exist
                    var user = await User.find({ email: email })
                    if (user.length > 0) {
                        reject({ msg: 'ce courriel existe déjà' })
                    } else {
                        const savedUser = await newUser.save();
                        const { password, ...others } = savedUser._doc;
                        resolve(others)
                    }
                } catch (error) {
                  
                    reject({ msg: "quelque chose s'est mal passé.Veuillez réessayer plus tard", err: error })
                }
            })
        }
    })

}

// Update User
exports.upDateUser = (body, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateUser = await User.findByIdAndUpdate(id, {
                $set: body
            }, { new: true });
            resolve( updateUser )
        } catch (error) {
            reject({ msg: "quelque chose s'est mal passé.Veuillez réessayer plus tard", err: error })
        }
    })
}

exports.findUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id);
            const { password, ...others } = user._doc;
            resolve(others)
        } catch (error) {
            reject({ msg: "quelque chose s'est mal passé.Veuillez réessayer plus tard", err: error })
            res.status(500).json(error);
        }
    })
}

exports.getAllTeacher = (query) => {
    return new Promise(async (resolve, reject) => {
        // const query = req.query.new;
        try {
            const users = query
                ? await User.find({ role: "teacher" }).sort({ _id: -1 })
                : await User.find({ role: "teacher" });
            resolve(users)
        } catch (error) {
            reject({ msg: "quelque chose s'est mal passé.Veuillez réessayer plus tard", err: error })
        }
    })
}

exports.getAllStudent = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = query
                ? await User.find({ role: "student" }).sort({ _id: -1 })
                : await User.find({ role: "student" });
            resolve(users)
        } catch (error) {
            reject({ msg: "quelque chose s'est mal passé.Veuillez réessayer plus tard", err: error })
        }
    })
}


// delete Student
exports.deleteStudent = (studentId) => {
    return new Promise(async (resolve, reject) => {
        const session = await mongoose.startSession();
        try {
            // Delete project
            await Subscription.deleteMany({ studentId:studentId }, { session });

             const student = await User.findById(studentId).session(session);
             if (!student) {
                reject(`Étudiant avec pièce d'identité ${studentId} pas trouvé`)
              }
        
             await User.deleteOne({_id:student.id}, { session })
              resolve("Étudiant supprimé avec succès")
        } catch (error) {
       
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard",err:error})
        } finally {
            session.endSession();
        }
    })
}

// delete Teacher
exports.deleteTeacher = (teacherId)=>{
    return new Promise(async (resolve, reject) => {
        const session = await mongoose.startSession();
        try {
            // find all project that teacher has 
          var projects =  await Project.find({teacher : teacherId })

          projects.forEach(async (project)=>{
            // we need to delete all susbcription to every project 
            await Subscription.deleteMany({ projectId:project.id }, { session });
            // delete project
            await Project.deleteOne({_id : project.id },{session})
          })
          // after delete all project and the subscription we need to delete the teacher
          const teacher = await User.findById(teacherId).session(session);
             if (!teacher) {
                reject(`Enseignant avec pièce d'identité  ${teacherId} pas trouvé`)
              }
              await teacher.deleteOne({_id:teacherId}, { session });
              resolve("Enseignant supprimé avec succès")
        }catch (error) {
   
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard",err:error})
        }finally {
            session.endSession();
        }
    })
}

