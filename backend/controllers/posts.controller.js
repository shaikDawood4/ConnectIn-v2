import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";

export const activeCheck = async(req,res)=>{
   
    res.status(200).json({message : "running"});
}


export const  createPost= async(req,res)=>{
  const {token}= req.body;
    try{
     
    const user = await User.findOne({token : token});
    console.log(user)
    if(!user) return res.status(404).json({message : "user not found"});
    

   
    const post = new Post({
        userId : user._id,
        body : req.body.body,
        media : req.file != undefined ? req.file.filename : "",
        fileType : req.file != undefined ? req.file.mimetype.split("/")[1] : ""  // fileType is derived from extention
    })

    await post.save();
    return res.status(200).json({message : "Post created"})

    }

    catch(err){
        return res.status(500).json({message : err.message});
    }
}



export const deletePost = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { token, post_id } = req.body;

    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "user not found" });

    const post = await Post.findOne({ _id: post_id });
    console.log(post_id)
    if (!post) return res.status(404).json({ message: "post not found" });

    if (user._id.toString() !== post.userId.toString()) {
      return res.status(401).json({ message: "unAuthorized access" });
    }

    await Post.deleteOne({ _id: post._id });

    return res.status(200).json({ message: "post deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getAllPosts = async(req,res)=>{
    try{
        const posts = await Post.find() .populate('userId', 'name username email profilePicture')
        return res.json({posts});
    }catch(err){
        return res.status(500).json({message : err.message});
    }
}





export const commentPost = async(req,res)=>{
    try{
       const {postId, token, commentBody} = req.body;


          console.log("REQ BODY:", req.body);
       console.log("postId received:", postId);

       const user = await User.findOne({token : token}).select('_id');
       if(!user) return res.status(404).json({message : "user not found"});

       const post = await Post.findOne({_id:postId});
       if(!post) return res.status(404).json({message : "post not found"});

       const newComment = new Comment({
        userId : user._id,
        postId : post._id,
        body : commentBody,
       })

       await newComment.save();
       return res.status(200).json({message : "comment added"})
    }
    catch(err){
        return res.status(500).json({message : err.message})
    }
}




export const get_comments_by_post = async (req, res) => {
    try {
        const { postId } = req.query;
        console.log("postId:", postId);

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "post not found" });

        const comments = await Comment.find({ postId: post._id })
        .populate("userId", "username name");

        return res.json(comments.reverse() );
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


export const delete_comments_of_user = async(req,res)=>{
    try{
        const { token, commentId } = req.body;

        const user = await User.findOne({token : token}).select('_id');
        if(!user) return res.status(404).json({message : "user not found"})
         
       const comment = await Comment.findOne({"_id" : commentId });
       if(!comment) return res.status(404).json({message : "comment not found"});

        if(comment.userId.toString() !== user._id.toString()){
            return res.status(404).json({message : "unAuthorized"});
        }

        await Comment.deleteOne({"_id" : commentId});

        return res.status(200).json({message : "comment deleted"});

    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export const increment_likes = async(req,res)=>{
    try{
        const { post_id} = req.body;
        const post = await Post.findOne({_id : post_id});
        if(!post) return res.status(404).json({message: "post not found"})

            post.likes = post.likes+1;

            await post.save();
    return res.status(200).json({message : "likes incremented"});
    }catch(err){
        return res.status(500).json({message : err.message});
    }
}
