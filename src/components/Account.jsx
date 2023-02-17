import { useState,  useEffect } from "react"
import { useNavigate } from "react-router-dom";
import logo1 from './assets/cropped-logo1.png'


export default function Account ({loggedInUser, setLoggedInUser}){
    const navigate = useNavigate()

    //state to hold all the reviews
    const [reviewArray, setReviewArray] = useState([])
    const [friendArray, setFriendArray] = useState([])
    const [usersArray, setUsersArray] = useState([])
    const [toggleLookFriendsRequests, setToggleLookFriendsRequests] = useState(false);
    const [toggleNewFriendSearch, setToogleNewFriendSearch] = useState(false);

    console.log(loggedInUser);

    //fetch all the reviews
    const fetchReviews = async () => {
        const req = await fetch('/reviews')
        const res = await req.json()
        setReviewArray(res)
    }
    useEffect(() => {
        fetchReviews()
    }, [])
    
    //fetch all the friends
    const fetchFriend = async () => {
        const req = await fetch('/friendship_tables')
        const res = await req.json()
        setFriendArray(res)
    }
    useEffect(() => {
        fetchFriend()
    }, [])

    //fetch all users
    const fetchUsers = async () => {
        const req = await fetch('/users')
        const res = await req.json()
        setUsersArray(res)
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    //flip state of the Friend Request tab toggle
    const handleToggleRequests = () => {
        setToggleLookFriendsRequests(!toggleLookFriendsRequests);
    }

    const handleToggleNewFriendSearch = () => {
        setToogleNewFriendSearch(!toggleNewFriendSearch);
    }

    //stops the code from running if the fetch for the reviews hasn't finished
    // if (!reviewArray[0]) return null
    

    //filter the reviews to only show the reviews that belong to the logged in user
    const filteredUserReviewArray = reviewArray.filter((review) =>{
        if (loggedInUser === undefined){
            return null
        }
        return loggedInUser.id === review.user_id
    })

    //filter the friends to only show the friends that belong to the logged in user
    const filteredUserFriendArray = friendArray.filter((friend) => {
        return (
            (loggedInUser.id === friend.user_1.id && friend.friend_status === 1) 
            || 
            (friend.user_2.id === loggedInUser.id && friend.friend_status === 1)
        )
    })
    //filter the friend array to only show the friend requests that belong to the logged in user
    const pendingFriendRequestArray = friendArray.filter((friend) => {
        return (
            (loggedInUser.id !== friend.user_1.id && friend.friend_status === 0) 
            || 
            (friend.user_2.id !== loggedInUser.id && friend.friend_status === 0)
        )
    })

    //filter the friend array to users that are on the table with some sort of relationship to the logged in user
    const allFriendArray = friendArray.filter((friend) => {
        return (
            (loggedInUser.id === friend.user_1.id) 
            || 
            (friend.user_2.id === loggedInUser.id)
        )
       
    })
    
    // turn the array of friends into an array of user_ids that have a relationship with the logged in user
    const allFriendUserIds = allFriendArray.map((friend) => {         

        if (loggedInUser.id === friend.user_1.id){
            return (friend.user_2.id)
        }
        else{
            return (friend.user_1.id)
        }    
    })

    //filer the user array to take out the logged in user
    const userArrayNoLoggedInUser = usersArray.filter((user) => {
        return(
            user.id !== loggedInUser.id
        )        
    })

    //filter the user array to take out the users that have a relationship with the logged in user
    const filteredUserArray = userArrayNoLoggedInUser.filter(function(user){
        return allFriendUserIds.filter(function(friend){
            return friend == user.id;
        }).length == 0
    })
    

    function logOut(){   
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                navigate('/')
                setLoggedInUser(null)
            }
        })
     }

    //if the user is not logged in, don't show and info on this page and tell them to log in
    if (loggedInUser === undefined){
        return(
            <div>
                <h1>Please Log in or Create an Account</h1>
                <br></br>
                <button type="button" onClick={() => navigate('/home')}> Home</button>
            </div>
        )
    }
    //if there is a logged in user, show this info on the page
    else{
        return(
            <div className="account-info-page">
            <div className="header-div">
                <img className="header-logo" src={logo1} onClick={() => navigate('/home')}/>
                <div className="nav-bar">
                    <button type="button" onClick={() => navigate('/about')}> About</button>
                    <button type="button" onClick={() => navigate('/crawllist')}> View All Crawls</button>
                    <button type="button" onClick={() => navigate('/eventslist')}>View All Events</button>
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={logOut}> Exit</button>

                </div>
            </div>
            <div className="bar-info-container">
                <h1 className="bar-info-name"> Account  Info</h1>
                <div className="details-reviews-container">

                    <div className="bar-info-details">
                        <h2 className="user-info-title">Username: </h2> 
                        <h2 className="user-info-detail">{loggedInUser.real_name}</h2>
                        <h2 className="user-info-title">Display Name:  </h2>
                        <h2 className="user-info-detail">{loggedInUser.username}</h2>
                        <h2 className="user-info-title">Password:  </h2>
                        <h2 className="user-info-detail">{loggedInUser.password} ***********</h2>
                    </div>
                <div className="user-review-container">

                    <h1 className="your-reviews">Your Reviews</h1>
                    {/* show all of the users reviews */}
                    <div className="scroll-reviews">
                    {filteredUserReviewArray.map((review) => {
                        return (
                            <UserReviewCard
                                key={review.bar_id}
                                review={review}
                                bar={review.bar}
                            />
                        )
                    })}                    
                    </div>
                </div>
            </div>
                <div className="friend-list">                   

                    <h1 className="friend-list-title"> Friends List</h1>
                    {/* show all of the users friends */}
                    {filteredUserFriendArray.map((friend) => {
                        return (
                            <UserFriendCard
                                key={friend.id}
                                friend={friend}
                                loggedInUser={loggedInUser}
                            />
                        )
                    })}

                    {/* show friend requests */}
                    <button
                        className="look-for-friends-button"
                        onClick={handleToggleRequests}
                    > See Friend Requests
                    </button>
                        { toggleLookFriendsRequests ? 
                            <div className="lookfriend-form-popup">
                            <div className="form-div">
                                <div className="friends-lookup">
        
                                <h3> All Users </h3>
                                <button className="exit-form" onClick={handleToggleRequests}> Hide Users </button>
                                <br></br>
                                {pendingFriendRequestArray.map((friend) => {
                                    return(
                                        <PendingFriend 
                                            key={friend.id}
                                            friend={friend}
                                            loggedInUser={loggedInUser}
                                        />                                            
                                    )
                                })}            
                                </div>
                            </div>            
                        </div>
                        :
                        null           
                    }

                    {/* Show new new friend search */}
                     <button
                        className="look-for-friends-button"
                        onClick={handleToggleNewFriendSearch}
                    > Look for more friends
                    </button>
                        { toggleNewFriendSearch ? 
                            <div className="lookfriend-form-popup">
                            <div className="form-div">
                                <div className="friends-lookup">
        
                                <h3> All Users </h3>
                                <button className="exit-form" onClick={handleToggleNewFriendSearch}> Hide Users </button>
                                <br></br>
                                {filteredUserArray.map((user) => {
                                    return(
                                        <NewFriend user={user}/>
                                    )
                                })}            
                                </div>
                            </div>            
                        </div>
                        :
                        null           
                    }    

                </div>
            </div>
            </div>
        )
    }
}

//the card that shows each of the user's reviews
function UserReviewCard({review, bar}){
    return(
        <div className="user-review-card">

            <div className="user-review-bar">{review.bar?.name}</div>
            <div className="user-review-rating">{review.star_rating}</div>
            <div className="user-review-body">{review.content}</div>            
        </div>
    )
}

//the card that shows each of the user's friends
function UserFriendCard({friend, loggedInUser}){

    return(
        <div className="user-friendslist-card">
            <div className="friend-user">username: {loggedInUser.id === friend.user_1.id ? friend.user_2.username : friend.user_1.username}</div>       
            <div className="friends">name: {loggedInUser.id === friend.user_1.id ? friend.user_2.real_name : friend.user_1.real_name}</div>       
            <div className="friend-user">email: {loggedInUser.id === friend.user_1.id ? friend.user_2.email : friend.user_1.email }</div>       
            <br></br>
        </div>        
    )
}


function acceptFriend() {
    console.log("accept friend")
}

function PendingFriend({friend, loggedInUser}){
    return(
        <div className="potential-friend-details">
            <br></br>
            <div className="friend-user">username: {loggedInUser.id === friend.user_1.id ? friend.user_2.username : friend.user_1.username}</div>       
            <div className="friends">name: {loggedInUser.id === friend.user_1.id ? friend.user_2.real_name : friend.user_1.real_name}</div>       
            <div className="friend-user">email: {loggedInUser.id === friend.user_1.id ? friend.user_2.email : friend.user_1.email }</div>     
            <button onClick={acceptFriend}>Accept Friend Request</button>
            <br></br>  
        </div>
    )
}

function setFriendRequest() {
    console.log("set friend request")
}

function NewFriend({user}){
    return(
        <div className="potential-friend-details">
            <br></br>

            <div className="review-real-name"> Name: {user.real_name} </div>
            <div className="review-username"> Username: {user.username}/5</div>
            <div className="review-email"> Email: {user.email} </div> 
            <button onClick={setFriendRequest}>Send Friend Request</button>
            <br></br>  
        </div>
    )
}
