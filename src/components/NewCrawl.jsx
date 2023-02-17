import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "semantic-ui-react";
import logo1 from './assets/cropped-logo1.png';
import barPhoto from './assets/another-bar-photo.jpg'
import { InputSharp } from "@mui/icons-material";



export default function NewCrawl({barCrawlData, loggedInUser, setLoggedInUser}){

    const [barCrawlNameInput, setBarCrawlNameInput] = useState("")

    const navigate = useNavigate()

    
    //fetch all the bars 
    const [barArray, setBarArray] = useState([])
    useEffect(() => {
        const fetchBars = async () => {
            const req = await fetch('/bars')
            const res = await req.json()
            setBarArray(res)
        }        
        fetchBars()
    }, [])  

    //hold the code untill we finish the fetch
    if (!barArray[0]) return null

    //turn the string of bar ID's into an array of numbers
    const barCrawlString = barCrawlData
    let barCrawlIDArray = barCrawlString.split(',').map(Number)    
    let barCrawlArray = []
    let barCrawlDummy = null
    barCrawlIDArray.map((id)=>{
        barCrawlDummy = barArray.filter((bar) =>{
            return bar.id === id
        })
        barCrawlArray.push(barCrawlDummy)
    })


    //keep track of the number of the bar in the crawl
    let barCrawlNumber = 0
    let totalCrawlBars = barCrawlArray.length

        //function to log out by setting the state of the logged in user to undefined
     //and navigating back to the login page
     function logOut(){
        // setLoggedInUser(undefined)
        // navigate('/')
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                setLoggedInUser(null)
                navigate('/')
            }
        })
     }

    return(
        <div className="crawllist-page">
            <div className="header-div">
                <img className="header-logo" src={logo1} onClick={() => navigate('/home')}/>
                <div className="nav-bar">
                    <button type="button" onClick={() => navigate('/about')}> About</button>
                    <button type="button" onClick={() => navigate('/crawllist')}> View All Crawls</button>
                    <button type="button" onClick={() => navigate('/eventslist')}>View All Events</button>
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={loggedInUser ? logOut : () => navigate('/')}> Exit</button>
                </div>
            </div>
            <img className="crawllist-image" src={barPhoto} />
            <h1 className="crawllist-page-title">{loggedInUser.real_name}, Create a New Crawl!</h1>

            <div className="list-and-form">
            {barCrawlArray.map((bar) => {
                //udpate the number of the bar in the crawl
                barCrawlNumber += 1
                return(
                    <div>
                        
                    <CrawlBar 
                        bar={bar} 
                        barCrawlNumber={barCrawlNumber} 
                        totalCrawlBars={totalCrawlBars}
                    />
                    </div>
                )
            })}
            <NewCrawlSaveForm 
                barCrawlString={barCrawlString} 
                barCrawlNameInput={barCrawlNameInput}
                setBarCrawlNameInput={setBarCrawlNameInput}
                loggedInUser={loggedInUser}
            />

            </div>
        </div>
    )
}


//change the grammer based on where we are on the list
function grammerForDisplayingCarwlBarSequence(barCrawlNumber, totalCrawlBars){ 
    if (barCrawlNumber === 1) {
        return `You are starting at `
    } else if (barCrawlNumber === totalCrawlBars) {
        return `You are ending at `
    } else {
        return `Then you are going to `
    }
}

function CrawlBar({bar, barCrawlNumber, totalCrawlBars}){
    return(
        <div className="new-crawl-list">
            <h3>
                <p className="review-author">{grammerForDisplayingCarwlBarSequence(barCrawlNumber, totalCrawlBars)} </p>
                <p className="review-detail">{bar[0].name} at {bar[0].location}</p>
            </h3>
        </div>
    )
}


function handleReviewSubmit(barCrawlString, barCrawlNameInput, loggedInUser){

    const formData ={
        bar_crawl_bars_id: barCrawlString,
        bar_crawl_name: barCrawlNameInput,
        user_id: loggedInUser.id,
        public_private: true
    }
    fetch ('/bar_crawls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        })
    .then(res => res.json())
}


function NewCrawlSaveForm({barCrawlString, barCrawlNameInput, setBarCrawlNameInput, loggedInUser}){

    return(
        <div className="save-crawl-form">
            <h1>Save your crawl</h1>
            <form 
                className="review-form" 
                onSubmit={(e) => {
                    e.preventDefault()
                    handleReviewSubmit(barCrawlString, barCrawlNameInput, loggedInUser)
                }}
            >
                <input 
                    placeholder="Crawl Name"
                    value={barCrawlNameInput}
                    autoComplete="off"
                    onChange={(e) => setBarCrawlNameInput(e.target.value)} 
                />
                <button type="submit">Save Crawl</button>
            </form>
        </div>
    )
}
