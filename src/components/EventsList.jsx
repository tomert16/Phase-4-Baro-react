import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import logo1 from './assets/cropped-logo1.png'
import {SlArrowRight} from 'react-icons/sl'



export default function EventsList({setLoggedInUser, loggedInUser}) {

    const navigate = useNavigate()
    const [eventArray, setEventArray] = useState([])
    const [barArray, setBarArray] = useState([])

     //fetch the array of all the events
     useEffect(() => {
        const fetchEvents = async () => {
            const req = await fetch('/crawl_events')
            const res = await req.json()
            setEventArray(res)
        }
        const fetchBars = async () => {
            const req = await fetch('/bars')
            const res = await req.json()
            setBarArray(res)        
        }

        fetchEvents()
        fetchBars()
    }, []) 
    //halts the code untill we finish fetching 
    if (!eventArray[0]) return null


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


    return (
        <div>
            
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


            <div>
                <h1>Event List</h1>
                {eventArray.map((event) => {
                    return(
                        <Event
                            event={event}
                            barArray={barArray}
                        />
                    )
                })}
            </div>


        </div>
    )
}


function Event({event, barArray}){


    
    
    //turn the string of bar ids into an array of bars in the crawl
    let barCrawlIDArray = event.bar_crawl.bar_crawl_bars_id.split(',').map(Number)
    let barCrawlArray = []
    let barCrawlDummy = null
    barCrawlIDArray.map((id)=>{
        barCrawlDummy = barArray.filter((bar) =>{
            return bar.id === id
        })
        barCrawlArray.push(barCrawlDummy)
    })
    
    console.log(barCrawlArray)

    return(

        <div>
            <h1>{event.event_name}</h1>
            <h2>Hosted by user {event.user_id}</h2>
            <h3>Bars in this Event:</h3>
            {barCrawlArray.map((bar) => {
                    return(
                        <EventBar bar={bar}/>
                    )
                })}
        </div>
    )
}


function EventBar({bar}){
    return(
        <div>
            <div> {bar[0].name} </div>   
            <img src={bar[0].image} alt={bar[0].name}/>
            <h1 className="crawl-arrow"> {<SlArrowRight />} </h1>
        </div>
    )
}