import {Router} from "express";
import { acceptConnectionRequest, findUser, getMyConnectionRequests,  getUserProfileAndUserBasedOnUsername,  registerUser, sendConnectionRequestion, whatAreMyConnectionequests } from "../controllers/user.controller.js";
import { getUserAndProfile, loginUser, updateProfile, updateUserProfile, uploadProfilePicture, getAllUserProfile, downloadProfile} from "../controllers/user.controller.js";
import multer from "multer"


const router = Router();

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, "uploads/")
    },
    filename : (req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload =  multer({storage : storage});


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update_profile_picture") .post(upload.single('profile_picture'),  uploadProfilePicture) 
//                                      phele ye handle hoga req.body se,since this comes before controller so, we are creating the multerStorage here only         fir ye controller sambhal lega                                                            
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfile);
router.route("/user/get_all_users").get(getAllUserProfile)
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequestion)
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnectionequests);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername);
router.route("/user/findUser").get(findUser);



export default router;