import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";

import { Form } from "semantic-ui-react";
import logo1 from '../logo1.png'

export default function LoginPage ({ setLoggedInUser}){
    const navigate = useNavigate();
    // const history = useHistory();
    //states used
    const [userArray, setUserArray] = useState([])
    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [errors, setErrors] = useState([])

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
    
    //handles setting who the logged in user is finding if there is a user name 
    //and password that match on the user array
    function handleLogin(){
        // let loginArray = userArray.filter((user) => {
        //     return user.username === usernameInput && user.password === passwordInput
        // })[0]
        // //if there is no user name and password that match then alert the user
        // if (loginArray === undefined){
        //     alert("Incorrect Username or Password")
        // //if there is a match we set the logged in user to the user that matched and go to the home page
        // }else{
        //     setLoggedInUser(loginArray)
        //     navigate('/home')
        // }
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( { "username": usernameInput, "password": passwordInput })
        }).then((r) => {
            if (r.ok) {
                r.json().then((user) => setLoggedInUser(user));
                navigate('/home');
            }else {
                r.json().then(json => setErrors(json.errors))
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
                {/* <h1 className="welcome">BarO</h1>
                <h2 className="motto">Bar Hopping Made Easy</h2> */}
                <img className="logo"  src={logo1}/>
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
                        {errors ? <div>{errors}</div>:null}
                        </Form> 
                    </div>
                </div>: null}
             </div>
            </div>
        )
    }
