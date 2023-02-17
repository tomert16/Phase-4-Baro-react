import { useNavigate,  useLocation } from "react-router-dom"
import { useState, useEffect } from "react";
import logo1 from './assets/cropped-logo1.png';
import barPhoto from './assets/another-bar-photo.jpg'

export default function EventPage ({loggedInUser, setLoggedInUser}) {

    const navigate = useNavigate()
    const {state} = useLocation()
    let event = state.event


    const [usersAtEventsArray, setUsersatEventsArray] = useState([])
    const [commemtsArray, setCommentsArray] = useState([])
    const [friendArray, setFriendArray] = useState([])
     //fetch the info we will need
     useEffect(() => {
        const fetchUsersAtEvents = async () => {
            const req = await fetch('/users_at_crawl_events')
            const res = await req.json()
            setUsersatEventsArray(res)
        }
        const fetchComments = async () => {
            const req = await fetch('/crawl_event_comments')
            const res = await req.json()
            setCommentsArray(res)        
        }
        const fetchFriend = async () => {
            const req = await fetch('/friendship_tables')
            const res = await req.json()
            setFriendArray(res)
        }    
        
        fetchUsersAtEvents()
        fetchComments()
        fetchFriend()
    }, []) 

        if (!friendArray[0]) return null

    
    
    const filteredUsersAtEventsArray = usersAtEventsArray.filter((user) => {
        return (user.crawl_event_id === event.id)
    })
    
    const filteredComments = commemtsArray.filter((comment) => {
        return (comment.crawl_event_id === event.id)
    })

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
        <div div className="crawllist-page">

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
            <h1 className="crawllist-page-title">{event.event_name}</h1>

            <div className="event-info-container">
            <div className="details-reviews-container">
                <div className="bar-info-details">
                    {/* <h1> {event.event_name} </h1> */}
                    <h2 className="bar-info-category"> {event.event_description} </h2>
                    <h3 className="bar-info-location"> Hosted by: {event.user_id} </h3>
                    <h3 className="bar-info-price"> People going to this Event </h3>
                    <div>
                        {filteredUsersAtEventsArray.map((user) => {
                            return(
                                <UsersAtThisEvent user={user}/>
                            )
                        })}
                        <InviteFriends
                            filteredUserFriendArray={filteredUserFriendArray}
                            loggedInUser={loggedInUser}
                        />
                    </div>
                </div>


                <div className="bar-reivew-container">
                    <h3 id="reviews">What invites are saying</h3>
                    <div className="scroll-reviews">
                        {filteredComments.map((comment) => {
                            return(
                                <EventComment comment={comment}/>
                            )
                        })}
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}


function UsersAtThisEvent(user){
    return(
        <div className="review-author">
            {user.user.user.real_name}
        </div>
    )
}

function EventComment(comment){
    return(
        <div>
            <p className="review-author">{comment.comment.user.real_name}</p>
            <p className="review-rating">{comment.comment.comment}</p>
        </div>
    )
}

function InviteFriends({filteredUserFriendArray, loggedInUser}){

    return (
        <div>
            <h3 className="bar-info-price">
                Invite Friends
            </h3>
            {filteredUserFriendArray.map((friend) => {
                return(
                    <InviteFriendButton 
                        friend={friend}
                        loggedInUser={loggedInUser}
                    />
                )
            })}
        </div>
    )
}

function InviteFriendButton({friend, loggedInUser}){
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
        <div >            
            <button className="invite-button" onClick={changeInviteStatus}>{inviteStatus ? "Uninvite" : "Invite"} {loggedInUser.id === friend.user_1.id ? friend.user_2.real_name : friend.user_1.real_name}</button>      
            <br></br>
        </div>  
    )
}