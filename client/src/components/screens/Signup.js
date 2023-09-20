import React,{useEffect, useState} from "react"
import {Link,useNavigate} from "react-router-dom";
import M from "materialize-css"
const Signup=()=>{
    const navigate = useNavigate();
    const [name, setName]= useState("")
    const [password, setPassword]= useState("")
    const [email, setEmail]= useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])
    const uploadPic=()=>{
        const data= new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dklisbls8")
        fetch("https://api.cloudinary.com/v1_1/dklisbls8/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
            
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid email", classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#b71c1c red darken-4"})
            }
            else{
                M.toast({html:data.message, classes:"#43a047 green darken-1"})
                navigate('/signin');
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const postData=()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }
    return(
        <div className="mycard">
            <div className="card auth-card .input-field">
                <h2>Instagram</h2>
                <input 
                type="text" 
                placeholder="name"
                value ={name}
                onChange={(e)=>setName(e.target.value)}/>
                <input 
                type="text" 
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input 
                type="password" 
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}/>
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e)=> setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" 
                onClick={()=>postData()}>
                    Signup
                    </button>
                    <h5>
                        <Link to = "/signup"> Don't have an account ?</Link>
                    </h5>
            </div>
        </div>
    )
}
export default Signup