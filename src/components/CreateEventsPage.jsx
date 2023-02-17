import { useNavigate, useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import { Form } from "semantic-ui-react"


export default function CreateEventsPage({loggedInUser}){
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

        
    return (
        <div>
            <h1>Event based on {crawl.bar_crawl_name}</h1>
            <EventForm 
                loggedInUser={loggedInUser}
                filteredUserFriendArray={filteredUserFriendArray}
                barCrawlArray={barCrawlArray}
            />
        </div>
    )
}

function postEvent(){
    console.log("post event")
}

function EventForm ({loggedInUser, filteredUserFriendArray, barCrawlArray}){

    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")

    return (
        <div>
            <div>
                <h4>Invite friends</h4>
                {filteredUserFriendArray.map((friend) => {
                    return(
                        <InviteFriends
                            friend={friend}
                            loggedInUser={loggedInUser}
                        />
                    )
                })}
            </div>
            <Form onSubmit={(e) => {
                e.preventDefault();
                postEvent()
            }}>
                <h2>Add Event Details</h2>
                <h3>Hosted by: {loggedInUser.real_name}</h3>
                <h4>Bars in this Crawl</h4>
                {barCrawlArray.map((bar) => {
                    return(
                        <BarName
                            bar={bar}
                        />
                    )
                })}
                <Form.Input fluid placeholder="Event Name" onChange={(e) => setEventName(e.target.value)}/>
                <Form.Input fluid placeholder="Event Description" onChange={(e) => setEventDescription(e.target.value)}/>
                <br></br>
                <Form.Button type="submit">Create Event</Form.Button>
            </Form>
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
        <div>
            <h5>{bar.bar[0].name}</h5>
            <h6>{bar.bar[0].location}</h6>
        </div>
    )
}
