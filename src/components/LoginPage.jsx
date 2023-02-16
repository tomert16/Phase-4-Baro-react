import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

import { Form } from "semantic-ui-react";
import logo1 from './assets/cropped-logo1.png'

export default function LoginPage ({ setLoggedInUser}){
    const navigate = useNavigate();
    
    //states used
    const [userArray, setUserArray] = useState([])
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")

    const [toggleLogin,  setToggleLogin] = useState(false);
    
    const handleToggle = () => {
        setToggleLogin(!toggleLogin);
    }

    const fetchUsers = async () => {
        const req = await fetch('http://localhost:3000/users')
        const res = await req.json()
        setUserArray(res)
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    
   
    function handleLogin(){
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( { "username": usernameInput, "password": passwordInput })
        }).then((r) => {
            if (r.ok) {
                r.json().then((user) => setLoggedInUser(user));
                navigate('/home');
            }
        });
    }
    //if the user wants to continue as a guest we set the logged in user to undefined and go
    // to the home page
    function handleGuestLogin(){
        setLoggedInUser(undefined)
        navigate('/home')
    }
    
    return(
        <div className="login-background">
            <div className="login-div">
                <img className="logo" src={logo1} />
                <button className="start-btn" onClick={handleToggle}>Begin Hopping</button>
                { toggleLogin ? <div className="form-popup">
                    <div className="form-div">
                        <Form className="login-form" onSubmit={(e) => {
                            e.preventDefault()
                            handleLogin()
                        }}>
                        <h3>Please Login</h3> 
                        <Form.Input fluid 
                            placeholder="User Name" 
                            value={usernameInput} 
                            autoComplete="off"
                            onChange={(e) => setUsernameInput(e.target.value)}
                        />
                        <Form.Input fluid 
                            type="password" 
                            placeholder="Password" 
                            value={passwordInput} 
                            autoComplete="current-password"
                            onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <Form.Button type="submit">Login</Form.Button>
                        <br/>
                        <button type="button" onClick={() => navigate('/newuser')}> Create an Account</button>
                        <br/>
                        <button type="button" onClick={() => handleGuestLogin()}> Continue as Guest</button>
                        <br/>
                        <button className="exit-form" onClick={handleToggle}>End Your Journey</button>
                        </Form> 
                    </div>
                </div>: null}
             </div>
            </div>
        )
    }
