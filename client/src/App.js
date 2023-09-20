
import React from 'react';
import {useEffect, createContext, useReducer,useContext} from 'react'
import NavBar from './components/navbar'
import "./App.css"
import { useNavigate } from 'react-router-dom';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribedUserPosts from './components/screens/SubscribesUserPosts'

export const UserContext= createContext()

const Routing=()=>{
  const navigate= useNavigate()
  const {state, dispatch}= useContext(UserContext)
  useEffect(()=>{
    console.log("@#$@#$")
    // console.log(localStorage.getItem("user"))
    const user1 = localStorage.getItem("user")
    console.log("user1")
    if(user1){
      const user = JSON.parse(localStorage.getItem("user"))
      dispatch({type:"USER", payload:user});
      navigate('/')
    }
    else{
      navigate('/signin')
    }
  }, [])
  
  return(
    
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/profile/:userid" element={<UserProfile />} />
          <Route path="/myfollowingpost" element={<SubscribedUserPosts />} />
      </Routes>
    
  )
}
function App() {
  const [state, dispatch]= useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <NavBar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
