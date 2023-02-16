import { useState,  useEffect } from "react"
import { useNavigate } from "react-router-dom";

export default function Account ({loggedInUser}){
    const navigate = useNavigate()

    //state to hold all the reviews
    const [reviewArray, setReviewArray] = useState([])
    const [friendArray, setFriendArray] = useState([])

    // console.log(loggedInUser);

    //fetch all the reviews
    const fetchReviews = async () => {
        const req = await fetch('http://localhost:3000/reviews')
        const res = await req.json()
        setReviewArray(res)
    }
    useEffect(() => {
        fetchReviews()
    }, [])
    
    //fetch all the friends
    const fetchFriend = async () => {
        const req = await fetch('http://localhost:3000/friendship_tables')
        const res = await req.json()
        setFriendArray(res)
        console.log(res)
    }
    useEffect(() => {
        fetchFriend()
    }, [])


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
        // if (loggedInUser.id  === friend.user_1.id){
            return loggedInUser.id === friend.user_1.id || friend.user_2.id === loggedInUser.id
        // }
        // else if (loggedInUser.id === friend.user_2.id){
            // return loggedInUser.id === friend.user_2.id
        // }

    })

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
            <div>
                <h1> Account  Info</h1>
                <button type="button" onClick={() => navigate('/home')}> Home</button>
                <div className="user-text">User:  {loggedInUser.real_name}</div>
                <div className="user-text">Display Name:  {loggedInUser.username}</div>
                <div className="user-text">Password:  {loggedInUser.password}</div>
                <div className="user-review-container">
                    ////////////////////////////////////////////
                    <div className="friend-list">
                    <h1> Friends List</h1>
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
                    </div>
                    <h2>Your Reviews</h2>
                    {/* show all of the users reviews */}
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
        )
    }
}

//the card that shows each of the user's reviews
function UserReviewCard({review, bar}){
    return(
        <div className="user-review-card">

            <div className="user-review-bar">{review.bar?.name}</div>
            <div className="review-rating">{review.star_rating}</div>
            <div className="review-body">{review.content}</div>            
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