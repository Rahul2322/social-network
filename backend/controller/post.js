const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "public image",
        url: "http",
      },
      owner: req.user._id,
    };
    const newPost = await Post.create(newPostData);

    const user = await User.findById(req.user._id);

    user.push.posts(newPost._id);

    await user.save();

    res.status(201).json({
      success: true,
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(400).json({
      success: false,
      message: "Post does not exist",
    });
  }
 
  if(post.owner.toString())
  const user = await User.findById(req.user_id);
  const index = user.posts.findIndexOf(post._id);
  user.splice(index, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Post deleted Successfully",
  });
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
      });
    }
    const user = await User.findById(req.user._id);

    if (post.likes.includes(user._id)) {
      const index = await post.likes.findIndexOf(user._id);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      post.likes.push(user._id);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPostOfFollowing = async(req,res)=>{
  try {
  const user = await User.findById(req.user._id);
  const posts = await Post.find({
  owner:{
    $in:user.following
  }
  })
  res.status(200).json({
    success:true,
    posts
  })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


exports.updateCaption = async(req,res)=>{
 try {
  const post = await Post.findById(req.params.id);
  if(!post){
    res.status(404).json({
      success:false,
      message:"No post found with this id"
    })
  }

  if(post.owner.toString() !== req.user._id.toString()){
   return res.status(401).json({
      success:false,
      message:"Unauthourized"
    })
  }
const {caption} = req.body;
if(!caption){
  res.status(400).json({
    success:false,
    message:"Please Provide caption for the post"
  })
}
  post.caption = req.body.caption

  await post.save();
 } catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
 }
}

exports.addComment = async(req,res)=>{
 try {
  const post = await Post.findById(req.params.id);
  if(!post){
    res.status(404).json({
      success:false,
      message:"post not found"
    })
  }

  let commentindex = 0;

  post.comments.forEach((item,index) => {
    if(item.user.toString() === req.user._id.toString()){
      commentindex = index
    }
    
  });

  if(commentindex){
    post.comments[commentindex].comment = req.body.comment;
    await post.save()
  }else{
    post.comments.push({
      user:req.user._id,
      comment:req.body.comment
    })
  }

  res.status(200).json({
    success:true,
    message:"comment added"
  })
 } catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
 }
}

exports.deleteComment = async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
  if(!post){
    res.status(404).json({
      success:false,
      message:"post not found"
    })
  }
//Checking if user wants to delete a comment
  if(post.owner.toString() === req.user._id.toString()){
    if(req.body.commentId == undefined){
      res.status(400).json({
        success:false,
        message:"CommentId is required"
      })
    }
    post.comments.forEach((item,index)=>{
      if(item._id.toString() === req.body.commentId.toString()){
        return post.comments.splice(index,1)
      }
    })
    await post.save();

   return res.status(200).json({
      success:true,
      message:"Selected comment has deleted"
    })

  }else{
    post.comments.forEach((item,index)=>{
      if(item.user.toString() === req.user._id.toString()){
        return post.comments.splice(index,1)
      }
    })

    await post.save();
    res.status(200).json({
      success:true,
      message:"comment deleted successfully"
    })
  }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}