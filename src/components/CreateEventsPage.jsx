import { useNavigate, useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import { Form } from "semantic-ui-react";
import logo1 from './assets/cropped-logo1.png';
import barPhoto from './assets/another-bar-photo.jpg';
import {SlArrowRight} from 'react-icons/sl'



export default function CreateEventsPage({loggedInUser, setLoggedInUser}){
    const [friendArray, setFriendArray] = useState([])
    const navigate = useNavigate()
    //get the info of the crawl from the prevous page
    const {state} = useLocation()
    let crawl = state.crawl
    let barCrawlArray = state.barCrawlArray

    useEffect(() => {
        const fetchFriend = async () => {
            const req = await fetch('/friendship_tables')
            const res = await req.json()
            setFriendArray(res)
        }    
        fetchFriend()
    }, [])

    const filteredUserFriendArray = friendArray.filter((friend) => {
        return (
            (loggedInUser.id === friend.user_1.id && friend.friend_status === 1) 
            || 
            (friend.user_2.id === loggedInUser.id && friend.friend_status === 1)
        )
    })

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

    return (
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
            <h1 className="crawllist-page-title">Plan {loggedInUser.real_name}'s Event</h1>
            
            <div className="crawllist-container">

            <h1 className="crawl-name">Your event is based on {crawl.bar_crawl_name}</h1>
            <h3 className="crawl-subtitle">Hosted by: {loggedInUser.real_name}</h3>
            <EventForm 
                loggedInUser={loggedInUser}
                filteredUserFriendArray={filteredUserFriendArray}
                barCrawlArray={barCrawlArray}
                crawl={crawl}
                navigate={navigate}
            />
            </div>
        </div>
    )
}


// function postEvent(){
//     console.log("post event")
// }

function EventForm ({loggedInUser, filteredUserFriendArray, barCrawlArray, crawl, navigate}){

    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")



    const postEvent = async () => {

        const eventObject = {
            event_name: eventName,
            event_description: eventDescription,
            user_id: loggedInUser.id,
            bar_crawl_id: crawl.id
        }


        fetch("/crawl_events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventObject)
        }).then ((r) => {
            if (r.ok) {
                r.json().then ((event) => navigate('/eventpage', {state: {event: event}}))
            }
        })
    }



    return (
        <div>

            <form onSubmit={(e) => {
                e.preventDefault();
                postEvent()
            }}>
                {/* <h2>Add Event Details</h2> */}
                {/* <h3>Hosted by: {loggedInUser.real_name}</h3> */}
                {/* <h4>Bars in this Crawl</h4> */}
                <div className="bar-crawl">
                {barCrawlArray.map((bar) => {
                    return(
                        <BarName
                            bar={bar}
                        />
                    )
                })}
                </div>
                <div className="create-event">
                <input className="create-event-input" placeholder="Event Name" onChange={(e) => setEventName(e.target.value)}/>
                <input className="create-event-input" placeholder="Event Description" onChange={(e) => setEventDescription(e.target.value)}/>
                <br></br>
                <button className="bar-crawl-review-button" type="submit">Create Event</button>

                </div>
                <br></br>
            </form>
        </div>
    )
}

function InviteFriends({friend, loggedInUser}){

    const [inviteStatus, setInviteStatus] = useState(false)

    function changeInviteStatus(){
        setInviteStatus(!inviteStatus)

        if (inviteStatus === false){
            console.log("user " + loggedInUser.id + " invited user " + (loggedInUser.id === friend.user_1.id ? friend.user_2.id : friend.user_1.id))
        }else{
            console.log("user " + loggedInUser.id + " uninvited user" + (loggedInUser.id === friend.user_1.id ? friend.user_2.id : friend.user_1.id))
        }
    }

    return(
        <div className="user-friendslist-card">            
            <button onClick={changeInviteStatus}>{inviteStatus ? "Uninvite" : "Invite"} {loggedInUser.id === friend.user_1.id ? friend.user_2.real_name : friend.user_1.real_name}</button>      
            <br></br>
        </div>  
    )
}

function BarName(bar){
    return(
        <div >
            <h5 className="crawl-bar">{bar.bar[0].name}</h5>
            <h6 className="crawl-bar-subtitle">{bar.bar[0].location}</h6>
            <img className="crawllist-img" src={bar.bar[0].image} alt={bar.bar[0].name}/>
            <h1 className="crawl-arrow"> {<SlArrowRight />} </h1>
        </div>
    )
}
