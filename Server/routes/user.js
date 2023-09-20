const express= require('express')
const router= express.Router()
const mongoose= require('mongoose')
const requireLogin= require('../middleware/requireLogin')
const User= mongoose.model("User")
const Post= mongoose.model("Post")


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        // .exec((err,posts)=>{
        //     if(err){
        //         return res.status(422).json({error:err})
        //     }
        //     res.json({user,posts})
        // })

        .then((posts) => {
            res.json({ user, posts });
        })
        .catch((err) => {
            return res.status(422).json({ error: err });
        });
                   
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    console.log("1req.user2")
    console.log(req.user)
    console.log(req.user._id)
    console.log("1req.body2")
    console.log(req.body)

        User.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{
            new:true
        }).then((result)=>{
            User.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{new:true} ).select("-password").then(result=>{
                // console.log(result)
                console.log("FOLLOWERS")
                console.log(req.user._id)
                // console.log(followers)
                // console.log("FOLLOWING")
                // console.log(req.body.followId)
                // console.log(following)
                res.json(result)
            })
            .catch(err=>{
                return res.status(422).json({error:err})
            })
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
})

// router.put('/follow', requireLogin, (req, res) => {
//     // Log relevant information
//     console.log("req.user:");
//     console.log(req.user);
//     console.log("req.user._id:");
//     console.log(req.user._id);
//     console.log("req.body:");
//     console.log(req.body);

//     // Update the user being followed
//     User.findByIdAndUpdate(req.body.followId, {
//         $push: { followers: req.user._id }
//     }, { new: true })
//         .then((result) => {
//             // Update the current user (follower)
//             User.findByIdAndUpdate(req.user._id, {
//                 $push: { following: req.body.followId }
//             }, { new: true }).select("-password")
//                 .then(result => {
//                     console.log("FOLLOWERS");
//                     console.log(req.user._id);
//                     res.json(result);  // Send the updated user information
//                 })
//                 .catch(err => {
//                     return res.status(422).json({ error: err });
//                 });
//         })
//         .catch(err => {
//             return res.status(422).json({ error: err });
//         });
// });





router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).then((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            console.log(result)
            res.json(result)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
})
// router.put('/updatepic',requireLogin,(req,res)=>{
//     console.log(req.user._id)
//     User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(err,result)=>{
//         if(err)){
//             return res.status(422).json({error:"pic cannot post"})
//         }
//         res.json(result)
//     })
// })

router.put('/updatepic', requireLogin,(req, res) => {
    try {
        const { pic } = req.body;
        const userId = req.user._id;

        if (!pic) {
            return res.status(422).json({ error: "pic parameter is missing" });
        }
        User.findByIdAndUpdate(userId, { $set: { pic } }, { new: true }).then(result=>{
        res.json(result)
    })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports= router