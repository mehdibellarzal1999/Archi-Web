const Joi = require('joi');
const User = require('../model/User.model')
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
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

//create transprot email 
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS
    }
})

const strongRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const changePasswordSchema = Joi.object({
    password: Joi.string()
        .regex(strongRegex)
        .required()
        .messages({
            'string.pattern.base': 'Le mot de passe doit comporter 8 caractères ou plus avec un mélange de lettres, de chiffres et de symboles'
        }),
    repeat_password: Joi.ref('password')
       
});


// function to  for regester admin only use one time from postman
exports.regester = (body) => {
    return new Promise((resolve, reject) => {
        var { firstname, lastname, password, email } = body;
        var validation = shimaRegester.validate({ firstname: firstname, lastname: lastname, email: email, password: password });
        if (validation.error) {
            reject({ err: validation.error.details[0].message });
        } else {
            var newPassword = (password != null) ? password : process.env.DefaultPaaswordUser;
            bcrypt.hash(newPassword, 10).then(async (hassedPassword) => {
                const newUser = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hassedPassword,
                    role: 'admin'
                });
                try {
                    const savedUser = await newUser.save();
                    const { password, ...others } = savedUser._doc;
                    resolve({ message: 'enregistrez-vous avec succès', user: others })
                } catch (err) {
                    reject({ message: "quelque chose s'est mal passé.Veuillez réessayer plus tard!!", err: err })
                }
            })
        }
    })
}

exports.login = (body) => {
    return new Promise(async (resolve, reject) => {
        var { password, email } = body;
        const user = await User.findOne({ email: email });
        if (!user) return reject({ err: "Informations d'identification erronées" })
        bcrypt.compare(password, user.password, (err, result) => {
            if (result == true) {
                const accessToken = jwt.sign({
                    id: user.id,
                    role: user.role,
                }, process.env.JWT_SEC, { expiresIn: "3d" });
                const { password, ...others } = user._doc;
                return resolve({ user: others, accessToken:accessToken });
            }else{
                reject({err:"Informations d'identification erronées"})
            }
        })
    })
}

exports.sendCodeToEmail = (body)=>{
    return new Promise(async (resolve, reject)=>{
        var email = body.email
        try{
            const user = await User.findOne({ email: email });
        if (!user) reject({msg:"Informations d'identification erronées"});
        // generate code 
        var code = Math.floor(100000 + Math.random() * 900000);
        // send email to user
        transporter.sendMail({
            from: process.env.GMAIL, // sender address
            to: user.email, // list of receivers
            subject: "Reseive password from ARCH WEB", // Subject line
            text: `Hallo ${user.firstname}  ${user.lastname}`, // plain text body
            html: `<P><b>use this code to comferme taht you forget password ${code}</b<</P>`, // html body
        })
        resolve({ id: user.id, email: user.email, code: code })
        }catch(err){
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard!!", err:err})
        }
    })
}

exports.changePassword =(body)=>{
    return new Promise((resolve, reject)=>{
        var { password , email , repeat_password } = body
        var validation = changePasswordSchema.validate({ password:password , repeat_password:repeat_password });
        if (validation.error) {
            reject({ err: validation.error.details[0].message });
        } else {
            bcrypt.hash(password, 10).then((hashPassword)=>{
                User.findOneAndUpdate(
                    { email: email },
                    { password: hashPassword},
                    { new: true }
                ).then(updatedPassword => {
                    resolve({ msg: "Le mot de passe a été changé avec succès" })
                })
            })
        }
    })
}