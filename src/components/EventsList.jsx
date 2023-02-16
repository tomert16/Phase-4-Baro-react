import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import logo1 from './assets/cropped-logo1.png'


export default function EventsList({setLoggedInUser}) {

    const navigate = useNavigate()

    function logOut(){
        // setLoggedInUser(undefined)
        // navigate('/')
        fetch("http://localhost:3000/logout", {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                setLoggedInUser(null)
                navigate('/')
            }
        })
     }


    return (
        <div>
            
            <div className="header-div">
                <img className="header-logo" src={logo1} onClick={() => navigate('/home')}/>
                <div className="nav-bar">
                    <button type="button" onClick={() => navigate('/about')}> About</button>
                    <button type="button" onClick={() => navigate('/crawllist')}> View All Crawls</button>
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={logOut}> Exit</button>
                </div>
            </div>


            <h1>Event List</h1>
        </div>
    )
}