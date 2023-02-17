import { useNavigate,  useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function EventPage ({loggedInUser}) {

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
    
    return (
        <div>
            <h1> {event.event_name} </h1>
            <h2> {event.event_description} </h2>
            <h3> Hosted by: {event.user_id} </h3>
            <h3> People going to this Event </h3>
            <div>
                {filteredUsersAtEventsArray.map((user) => {
                    return(
                        <UsersAtThisEvent user={user}/>
                    )
                })}
            </div>
            <div>
                <h3>What invites are saying</h3>
                {filteredComments.map((comment) => {
                    return(
                        <EventComment comment={comment}/>
                    )
                })}
            </div>
            <InviteFriends
                filteredUserFriendArray={filteredUserFriendArray}
                loggedInUser={loggedInUser}
            />
        </div>
    )
}


function UsersAtThisEvent(user){
    return(
        <div>
            {user.user.user.real_name}
        </div>
    )
}

function EventComment(comment){
    return(
        <div>
            {comment.comment.user.real_name} commented {comment.comment.comment}
        </div>
    )
}

function InviteFriends({filteredUserFriendArray, loggedInUser}){

    return (
        <div>
            <h3>
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
        <div className="user-friendslist-card">            
            <button onClick={changeInviteStatus}>{inviteStatus ? "Uninvite" : "Invite"} {loggedInUser.id === friend.user_1.id ? friend.user_2.real_name : friend.user_1.real_name}</button>      
            <br></br>
        </div>  
    )
}