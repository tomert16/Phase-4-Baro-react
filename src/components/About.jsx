import { useNavigate } from "react-router-dom"


export default function About(){
    const navigate = useNavigate()



    return(
        <div>
            <h1>BarO </h1>
            <p>A phase 3 and 4 project made by Olivia, Tomer, James P, Daiel, and Avi</p>
            <button type="button" onClick={() => navigate('/home')}> Home</button>
        </div>        
    )
}
