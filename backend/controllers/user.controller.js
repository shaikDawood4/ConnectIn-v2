import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import Profile from "../models/profile.model.js";
import crypto from "crypto"
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
//  
const convertUserDataToPDF = async  (userData) =>{
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString('hex')+ ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);
   doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });

doc.fontSize(14).text(`Name: ${userData.userId.name}`);
doc.fontSize(14).text(`Username: ${userData.userId.username}`);
doc.fontSize(14).text(`Email: ${userData.userId.email}`);
doc.fontSize(14).text(`Bio: ${userData.bio}`);

doc.fontSize(14).text("Past work - ");
userData.pastWork.forEach((work, index) => {
  doc.fontSize(14).text(`Company Name: ${work.company}`);
  doc.fontSize(14).text(`Position: ${work.position}`);
  doc.fontSize(14).text(`Years: ${work.years}`);
});

doc.end();

return outputPath;

}


export const registerUser = async (req,res)=>{
    try {

        const {name ,email, username, password} = req.body;

        if(!name || !email || !username || !password) {
            return res.status(400).json({
                message : "All fields are required"
            });
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message : "user already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            name,
            password : hashedPassword
        });

        await newUser.save();

        const newProfile = new Profile({
            userId : newUser._id
        });

        await newProfile.save();

        // TOKEN

        const token = crypto.randomBytes(32).toString('hex');

        // SAVE TOKEN

        await User.updateOne(
            {_id : newUser._id},
            {token}
        );

        // SEND TOKEN
        console.log(token);
        return res.status(200).json({
            message : "User created successfully",
            token
        });

    }catch(err){

        return res.status(500).json({
            message : err.message
        });

    }
}

export const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        
        if(!email || !password){
            return res.status(404).json({message : "All fields are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message : "user doesnt exists"});
        }
        const isMatch = await bcrypt.compare( password, user.password);

        if(!isMatch){
            return res.status(404).json({message : "wrong credentials"});
        }
  
        const token = await crypto.randomBytes(32).toString('hex');


        await User.updateOne({_id : user._id}, {token});   // update karo ye doc ko jiska id hai ye .....   aur set karo ye.....

        return res.json({token})

    }catch(err){
        return res.status(400).json({message : err.message});
    }
}



export const uploadProfilePicture = async(req,res)=>{
    const {token} = req.body;
    try{
        
    const user = await User.findOne({token : token});

    if(!user) {
        return res.status(404).json({message : "user not found"});

    }
        
    user.profilePicture = req.file.filename;
    
    await user.save();
    res.status(200).json({message : "Successfully profile picture updated"})
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }



}


export const updateUserProfile = async (req,res)=>{             // update user 
    try{
        const {token, ...newUserData} = req.body;   // this is spread operator, alll remaininig stuff goes to newuD 
        const user = await User.findOne({token : token});
        if(!user){
            res.status(404).json({message : "user not found"});
        }

        const {username, email} = newUserData;   // taken from newUserData 

        const existingUser = await User.findOne({$or : [{username},{email}]});
        if(existingUser){
            if(existingUser || String(existingUser._id) !== String(user._id)){
                res.status(404).json({message : "user already exists"});
            }
        }

        Object.assign(user, newUserData);    // assign newData to user

        await user.save();
        return res.json({message : "User Updated"});




    }catch(err){
        res.status(500).json({message : err.message});
    }
}



export const getUserAndProfile = async(req,res)=>{
    try{
        const { token } = req.query;
        const user = await User.findOne({token: token});
        
        if(!user){
            return res.status(404).json({message : "user not found"});
        }

        const userProfile = await Profile.findOne({userId : user._id})
        .populate('userId', 'name email username profilePicture')     //CTO

        return res.json({userProfile});


    }catch(err){
        res.status(500).json({message : err.message});
    }
}


export const updateProfile = async(req,res)=>{
    try{
        const {token , ...newProfileData} = req.body;
        
        const user = await User.findOne({token : token});
        if(!user) return res.status(404).json({message : "user not found"})
        
            const profile_to_update = await Profile.findOne({userId : user._id});
            if(!profile_to_update) return res.status(404).json({message : "User Profile doesnt exist"});

            Object.assign(profile_to_update, newProfileData);  // 

            await profile_to_update.save();
            return res.status(200).json({message : "profile update success"})


    }
    catch(Err){
        res.status(500).json({message : Err.message});
    }
}


export const getAllUserProfile = async(req,res)=>{
    try{
        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        res.status(200).json({profiles});
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}



export const downloadProfile = async(req,res)=>{
    const user_id= req.query.id;
    const userProfile = await Profile.findOne({userId : user_id})
    .populate('userId', 'name username email profilePicture');


    let outputPath =await convertUserDataToPDF(userProfile);
    return res.json({"message" : outputPath})
}




export const sendConnectionRequestion = async(req,res)=>{
    try{
        //get token, connectionId
           const {token, connectionId} = req.body;

        //find user 
          const user = await User.findOne({token : token});
        if(!user) return res.status(404).json({message : "user not found"});
        //find the person to whom connection is being sending 
        const connectionUser = await User.findOne({_id: connectionId});

        if(!connectionUser) return res.status(404).json({message : "unable to send request to user "});

        // if connection req is already sent ? 
        const existingRequest = await ConnectionRequest.findOne({
            userId : user._id,
            connectionId : connectionId
        })

        if(existingRequest) return res.json({message : "request already sent "});
       // if there is no existing req 
       const request = new ConnectionRequest({
        userId : user._id,
        connectionId : connectionId
       })

       await request.save();
       res.status(200).json({message : "connection request sent "});
        
        
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

// to whom im following
export const getMyConnectionRequests = async(req,res)=>{
    try {
       const {token} = req.query;
       
       const user = await User.findOne({token : token});

       if(!user) return res.status(404).json({message :"user not found"});

       const connections = await ConnectionRequest.find({userId : user._id})
      .populate('connectionId' ,'name username email profilePicture');

      return res.status(200).json({connections});


    }
     catch(err){
            return res.status(500).json({message : err.message}) ;
        }
}

//who has sent me reqs?
export const whatAreMyConnectionequests = async(req,res)=>{
    try{
        const {token} = req.query;

        const user = await User.findOne({token : token});

        if(!user ) return res.status(404).json({message : "user not found "});

        const connections = await ConnectionRequest.find({connectionId : user._id})
        .populate('userId', 'name username email profilePicture');


        return res.status(200).json({connections})



    }
    catch(err){
        return res.status(500).json({message : err.message });
    }
}


export const acceptConnectionRequest = async (req,res)=>{
    try{
        const {token, requestId, actionType} = req.body;

        const user = await User.findOne({token : token});
        if(!user) return res.status(404).json({message : "user not found"});


        const connection = await ConnectionRequest.findOne({_id : requestId});
        if(!connection) return res.status(404).json({message : "connection not found"});

        if(actionType === "accept") {
            connection.status_accepted = true;
        }
        else{
            connection.status_accepted = false;
        }


        await connection.save();
        return res.status(200).json({message:"request updated"});
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}


export const getUserProfileAndUserBasedOnUsername = async(req,res)=>{
     
    const{username} = req.query;

    try{
        const user = await User.findOne({username});

        if(!user){ return res.status(404).json({message : "user not found"});
     }

     const userProfile = await Profile.findOne({userId : user._id})
     .populate("userId", "name username email profilePicture");

     return res.json({"profile" : userProfile})


    }catch(err){
        return res.status(500).json({message : err.message})
    }
}

export const findUser = async (req, res) => {

    try {

        const { name } = req.query;

        // find matching users
        const users = await User.find({
            name: {
                $regex: name,
                $options: "i"
            }
        });

        // extract user ids
        const userIds = users.map((user) => user._id);

        // find profiles using those ids
        const userProfiles = await Profile.find({
            userId: {
                $in: userIds
            }
        }).populate('userId', 'name username email profilePicture');

        // no users found
        if (userProfiles.length === 0) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        return res.status(200).json({
            userProfiles
        });

    }
    catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

}