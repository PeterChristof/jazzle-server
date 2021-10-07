const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const user = require("../models/User.model");

router.get("/userprofile", async (req, res) => {
    try {
        console.log("session", req);
      const user = await User.findById(req.session.currentUser._id).populate("followers").populate("followings");
  
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  });

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    //You will get all document except these two attributes password/updatedAt
    const { password, updatedAt, ...other } = user._doc;

    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        // if (post.userId == req.body.userId) {
        //     await post.deleteOne()
        // }
        res.status(200).json({message: `User ${req.params.id} was deleted`})
    // } else { res.status(500).json("You can only delete your post")}
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});


// router.get("/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         res.status(200).json(user);
//     } catch(e) {
//         res.status(500).json({message: e});
//     }
// });

// follow routes

//await axios.put("http:/locslbla/:id/follow")

router.put("/:id/follow", async (req, res) => {
  if (req.session.currentUser._id != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.session.currentUser._id);

      if (!user.followers.includes(req.session.currentUser._id)) {
        await user.updateOne({
          $push: { followers: req.session.currentUser._id },
        });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this User");
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.session.currentUser._id != req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.session.currentUser._id);
      if (user.followers.includes(req.session.currentUser._id)) {
        await user.updateOne({
          $pull: { followers: req.session.currentUser._id },
        });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't  follow this user");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
