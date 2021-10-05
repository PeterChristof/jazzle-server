const router = require("express").Router()
const e = require("express");
const Like = require("../models/Like.model.js");
const Post = require("../models/Post.model.js");
const User = require("../models/User.model.js");
const { post } = require("./index.js");
// const fileUpload = require("../config/cloudinary");

router.post("/post",async(req,res)=>{
    const {title, description, songLink, postedBy,
        // likes, 
// comments
} = req.body;
    if (!title || !description || !songLink) {
        res.status(400).statusMessage({message: "missing fields - complete your post"});
        return;
    } try {
        const response = await Post.create({title, description, songLink, postedBy,
            // likes,
            // comments
        });
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

router.get("/post", async (req, res) => {
    try {
        console.log("here")
        const post = await Post.find().sort({ createdAt: -1}).populate("postedBy");
        res.status(200).json(post);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

router.delete("/post/:id", async (req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.id);
        // if (post.userId == req.body.userId) {
        //     await post.deleteOne()
        // }
        res.status(200).json({message: `Post with id ${req.params.id} was deleted`})
    // } else { res.status(500).json("You can only delete your post")}
    } catch(e) {
        res.status(500).json({message: e});
    }
});

router.put("/post/:id", async (req, res) => {
    const {title, description, songLink, postedBy,
        // likes,
        //  comments
        } = req.body;
try {
    const response = await Post.findByIdAndUpdate(
        req.params.id, {
            title, description, songLink, postedBy,
            // likes,
            //  comments
            },
            {new: true}
    );
    res.status(200).json(response);
        } catch(e) {
            console.log("error", e)
            res.status(500).json({message:e.message});
        }
});

    // router.post("/upload", fileUpload.single("file"), (req, res) => {
    //     try {
    // res.status(200).json({ fileUrl: req.file.path });
    //     } catch(e) {
    // console.log("error", e);
    // res.status(500).json({ message: e.message });
    // }
    // });



router.post("/post/:postId/like", async (req, res) =>{
    const post = await Post.findById(req.params.postId);
    const user = await User.findById(req.session.currentUser._id);
    console.log(post);
    console.log(user);

try {
    const like = await Like.create({
        user,
        post
    });

    const newPost = await Post.findByIdAndUpdate(req.params.postId, {
        $push:{
            likes: like
        }
    }, { new: true})
    res.status(200).json(newPost)
} catch (error) {
    console.log("error", e)
        res.status(500).json({message:e.message});
}
    
});


router.post("/post/:postId/comment", async (req, res) => {
    try {
    const { comment } = req.body;
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: { comment } },
    }, {new: true})
    
    res.status(200).json(newPost);
    } catch (error) {
        console.log("error", e)
            res.status(500).json({message:e.message});
    }
  });






// router.post("/post/:postId/comment", async (req, res) =>{
//     const post = await Post.findById(req.params.postId);
//     const user = await User.findById(req.session.currentUser._id);
//     console.log(post);
//     console.log(user);

// try {
//     const comment = await Comment.create({
//         user,
//         post
//     });

//     const newPost = await Post.findByIdAndUpdate(req.params.postId, {
//         $push:{
//             comments: { comment, postedBy }
//         }
//     }, { new: true})
//     res.status(200).json(newPost)
// } catch (error) {
//     console.log("error", e)
//         res.status(500).json({message:e.message});
// }
// });


module.exports = router;