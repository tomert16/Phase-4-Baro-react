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
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={logOut}> Exit</button>
                </div>
            </div>
            <h1>BarO </h1>
            <p>A phase 3 and 4 project made by Olivia, Tomer, James P, Daiel, and Avi</p>
            <button type="button" onClick={() => navigate('/home')}> Home</button>
        </div>        
    )
}
