const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const subscriptionSchema = new mongoose.Schema({
    projectId: { type: ObjectId, ref: 'Project' },
    studentId: { type: ObjectId, ref: 'User' },
    result: [{skill:{ type: String ,required: true}, level:{ type: String,required: true ,enum:["Non acquise","En cours d'Acquisition", "Acquise"]}}],
}, { timestamps: true });


module.exports = mongoose.model("subscription", subscriptionSchema);