const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// router
const authRouter = require('./router/Auth.router')
const UserRouter = require('./router/User.router')
const ProjectRouter = require('./router/project.router')
const SubscriptionRouter = require('./router/subscription.router')


mongoose.connect(process.env.MONGO_URL).then(console.log("Connected to Mongo db")).catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'))
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRouter)
app.use('/api/user', UserRouter)
app.use('/api/Project', ProjectRouter)
app.use('/api/Subscription', SubscriptionRouter)



app.listen(PORT, () => {
    console.log("is connected!!");
})
