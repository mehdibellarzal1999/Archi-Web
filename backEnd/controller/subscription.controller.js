const Subscription = require('../model/subscription')
const Project = require('../model/Project')

exports.subscribe =(body)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const projectId = body.projectId;
            const studentId = body.StudentId;

            var checkSubscription = await Subscription.find({studentId:studentId , projectId:projectId})
            if (checkSubscription.length > 0) {
                reject({msg:"Vous êtes déjà inscrit dans ce projet."})
            }else{
                const project = await Project.findById(projectId).populate('teacher', 'firstname lastname').
            then(async(project) => {
                var skillsProject = project.skillsProject;
                var test = true;
                for(var i=0;i<skillsProject.length ; i++){
                    if(skillsProject[i].skill = body.result[i].skill){
                        if(skillsProject[i].status == "competences"){
                            if(body.result[i].level == "Non acquise"){
                                test=false
                                reject({msg:`le niveau de cette compétence ${skillsProject[i].skill} doit être au moins en cours pour souscrire à ce projet`})
                                break;
                            }
                        }else{
                            if(body.result[i].level != "Acquise"){
                                test=false
                                reject({msg:`le niveau de cette compétence ${skillsProject[i].skill} doit être acquis pour s'inscrire dans ce projet`})
                                break;
                            }
                        }
                    }
                }
                if(test){
                   const result =  body.result
                    const subscribe = new Subscription({ projectId, studentId, result });
                    await subscribe.save();
                    resolve({msg:'Vous vous êtes abonné au projet avec succès.'})
                }

            }).catch((err)=>{
                reject({msg:"Quelque chose s'est mal passé. Merci d'essayer plus tard!!", err:err})
            });
            }
        }catch (err) {
            console.error(err);
            reject({msg:"Quelque chose s'est mal passé. Merci d'essayer plus tard!!"})
        }
    })
}

exports.getSubscriptedProjectByIdStudent = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const subscriptions = await Subscription.find({ studentId : id }).populate({
                path: 'projectId',
                populate: {
                    path: 'teacher',
                    model: 'User',
                    select: 'firstname lastname email'
                }
            });
            const projects = subscriptions.map((subscribe) => {
                const project = (subscribe.projectId !=null ) ? subscribe.projectId.toJSON() : null;
                project.skillsProject = (subscribe.result) ? subscribe.result : [];
                return project;
            });
            resolve(projects);
        } catch (err) {
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard", err:err})
        }
    })
}



exports.getSubscriptedStudentsByIdProject = (id)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const subscriptions = await Subscription.find({  projectId : id }).populate('studentId');
            const students = subscriptions.map((subscribe) => {
                const student = subscribe.studentId.toJSON();
                student.result = subscribe.result;
                return student;
              });
              resolve(students)
        }catch (err) {
            reject({msg:"quelque chose s'est mal passé.Veuillez réessayer plus tard", err:err})

        }
    })
}
