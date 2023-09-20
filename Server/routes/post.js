const express= require('express')
const router= express.Router()
const mongoose= require('mongoose')
const requireLogin= require('../middleware/requireLogin')
const Post= mongoose.model("Post")


router.get('/allpost', requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        console.log(res)
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/getsubpost', requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        console.log(res)
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.post('/createpost', requireLogin, (req,res)=>{
    const {title,body,pic}= req.body
    if(!title|| !body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    // console.log(req.user)
    // res.send("ok")
    req.user.password= undefined
    const post= new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})
router.get('/mypost',requireLogin, (req,res)=>{
    console.log(req.user)
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    },{
        new:true
    })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }
    //     else{
    //         res.json(result)
    //     }
    // })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });

})
router.put('/unlike', requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }
    //     else{
    //         res.json(result)    
    //     }
    // })
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
})
router.put('/comment', requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment}
    },{
        new:true
    })
    // .exec((err,result)=>{
    //     if(err){
    //         return res.status(422).json({error:err})
    //     }
    //     else{
    //         res.json(result)
    //     }
    // })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });

})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .then((post)=>{
    if(post.postedBy._id.toString()===req.user._id.toString()){
        post.deleteOne({_id:req.params.postId})
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    }).catch((err)=>{
        if(err){
            return res.status(422).json({errorrrrr:err})
        }
    })
})


module.exports= router