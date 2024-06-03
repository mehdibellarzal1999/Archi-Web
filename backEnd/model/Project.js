const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// const ProjectSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     desc: { type: String, required: true },
//     img: { type: String, required: true },
//     startAt: { type: Date, default: Date.now, required: true },
//     endAt: { type: Date, required: true },
//     teacher: { type: ObjectId, ref: 'User' },
//     skillsProject : [{ skill:{ type: ObjectId, ref: 'Skill' } , status :{ type: String , required: true , default: 'obligatory', enum: ['obligatory', 'optional'] }}]
// }, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    startAt: { type: Date, default: Date.now, required: true },
    endAt: { type: Date, required: true },
    teacher: { type: ObjectId, ref: 'User' },
    skillsProject: [{ skill: { type: String, required: true }, status: { type: String, required: true, default: 'competences', enum: ['competences', 'competences prerequise'] } }]
}, { timestamps: true });


module.exports = mongoose.model("Project", ProjectSchema);