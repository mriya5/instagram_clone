import React, { useContext } from'react'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import {UserContext} from '../App'
const NavBar=()=>{
  const {state,dispatch}= useContext(UserContext)
  const navigate= useNavigate()
  const renderList=()=>{
    if(state){
      return[
        <li><NavLink to={"/profile"}>Profile</NavLink></li>,
        <li><NavLink to={"/create"}>Create Post</NavLink></li>,
        <li><NavLink to={"/myfollowingpost"}>My following Posts</NavLink></li>,
        <li>
           <button className="btn #42a5f5 blue darken-1"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              navigate('/signin')
            }}>
                    Logout
                </button>
        </li>
      ]
    }else{
          return[
            <li><NavLink to="/signin">Login</NavLink></li>,
          <li><NavLink to="/signup">Signup</NavLink></li>
          ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper white">
        <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
      </ul>
    </div>
  </nav>
        
    )
}
export default NavBar;