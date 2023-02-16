import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "semantic-ui-react";


export default function NewUser({ setLoggedInUser }) {

    const navigate = useNavigate()

    //states used for the form
    const [nameInput, setNameInput] = useState("")
    const [usernameInput, setUsernameInput] = useState("")
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [confirmPasswordInput, setConfirmPasswordInput] = useState("")


    //handles creating a new user when the from is submitted
    function handleCreateAcount(){
        const newUser = {
            real_name: nameInput,
            username: usernameInput,
            email: emailInput,
            password: passwordInput,
            password_confirmation: confirmPasswordInput
        }
        fetch('/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        }).then ((r) => {
            if (r.ok) {
                r.json().then ((user) => setLoggedInUser(user))
                navigate("/")
            }
        })
    }


    return(
        <div className="form-div-create-acount">
            <Form className="create-acount-form" onSubmit={(e) => {
                e.preventDefault()
                handleCreateAcount()
            }}>
            <h3>Please Make an Account</h3> 
            <Form.Input fluid placeholder="Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)}/>
            <Form.Input fluid placeholder="User Name" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)}/>
            <Form.Input fluid placeholder="Email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
            <Form.Input fluid type="password" value={passwordInput} placeholder="Password" onChange={(e) => setPasswordInput(e.target.value)}/>
            <Form.Input fluid type="password" value={confirmPasswordInput} placeholder="Confirm Password" onChange={(e) => setConfirmPasswordInput(e.target.value)}/>
            <Form.Button type="submit">Create an Account</Form.Button>
            <br/>
            </Form> 
            <button className="exit-form" onClick={() => navigate('/')}>Back</button>
        </div>        
    )
}


