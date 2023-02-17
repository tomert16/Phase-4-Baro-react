import { useNavigate } from "react-router-dom"
import logo1 from './assets/cropped-logo1.png'



export default function About({setLoggedInUser}){
    const navigate = useNavigate()

    //function to log out by setting the state of the logged in user to undefined
     //and navigating back to the login page
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

    return(
        <div className="about-page">
            <div className="header-div">
                <img className="header-logo" src={logo1} onClick={() => navigate('/home')}/>
                <div className="nav-bar">
                    <button type="button" onClick={() => navigate('/about')}> About</button>
                    <button type="button" onClick={() => navigate('/crawllist')}> View All Crawls</button>
                    <button type="button" onClick={() => navigate('/eventslist')}>View All Events</button>
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={logOut}> Exit</button>
                </div>
            </div>
            <div className="about-container">
            <img className="about-logo" src={logo1} />
            <p>A phase 3 and 4 project made by Avi, Daniel, Olivia, and Tomer.</p> 
            <p id="dedication">In Memoriam of: James Prawdzik</p>
            </div>
        </div>        
    )
}
