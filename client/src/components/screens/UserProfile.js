import React, {useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'
import { useParams } from 'react-router-dom';
const Profile=()=>{
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}= useContext(UserContext)
    const { userid } = useParams()
    console.log("8e7hbjbcj")
    console.log(userid)
    console.log("userProfile")
    const [showFollow, setShowFollow]= useState(state?!state?.following?.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log("chkac")
            console.log(userid)
            console.log("54365data")
            console.log(data)
            console.log("12738usbcms")
            console.log(data.followers)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data)) 
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                  }
                }
            })  
            setShowFollow(false) 
        })
    }
    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log("95686data")
            console.log(data)
            console.log(data.followers)
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data)) 
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item => item !== data._id);
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                  }
                }
            })
            setShowFollow(true)
             
        })
    }    
    console.log("qte7ycbsdck")
    console.log(userProfile?.user?.followers?.length)

    return(
        <h1>
            {userProfile? 
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
            display:"flex",
            justifyContent:"space-around",
            margin:"18px auto",
            borderBottom: "1px solid grey"}}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                    src={userProfile?.user.pic}
                    />
                </div>
                <div>
                    <h4>{userProfile?.user?.name}</h4>
                    {/* <h5>{userProfile.user?.email}</h5> */}
                    <div style={{display:"flex", justifyContent:"space-between", width:"110%"}}>
                        <h6>{userProfile?.posts?.length} Posts</h6>
                        <h6>{userProfile?.user?.followers?.length} Followers</h6>
                        <h6>{userProfile?.user?.following?.length} Following</h6>
                    </div>
                    {showFollow?

                    <button style={{
                        margin:"10px"
                    }} className="btn waves-effect waves-light #42a5f5 blue darken-1"
                    onClick={()=>followUser()}>
                        Follow
                    </button>
                 :
                    <button style={{
                        margin:"10px"
                    }} className="btn waves-effect waves-light #42a5f5 blue darken-1"
                    onClick={()=>unfollowUser()}>
                        UnFollow
                    </button>
                }
                  
                </div>
            </div>    
            <div className="gallery">
                {
                    userProfile.posts?.map(item=>{
                        return(
                            <img key={item._id} className= "item" src={item.photo} alt={item.title}/>
                        )       
                    })
                }
                 </div>
            </div> 
            : <h2>loading....!</h2>}
        </h1>
    )
}
export default Profile