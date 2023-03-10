// import { CoPresentSharp } from "@mui/icons-material";
import { useState,  useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Form } from "semantic-ui-react";
import logo1 from "../logo1.png";

export default function BarInfo({clickedBar, loggedInUser, setLoggedInUser}){

    
    const navigate = useNavigate()
    if ( clickedBar === undefined) {navigate('/home')}

    //states used
    const [reviewArray, setReviewArray] = useState([])

    useEffect(() => {
        

       const fetchReviews = async () => {
           const req = await fetch('/reviews')
           const res = await req.json()
           setReviewArray(res)
       }

        fetchReviews()
    }, [])

    
    if (!reviewArray[0]) return null



    
    //find on the reviews that belong to the bar that we are showing 
    const filteredReviewArray = reviewArray.filter((review) =>{
        
        return clickedBar.id === review.bar_id
    })

    const handleUpdateReview = (updatedReview) => {
        const updatedReviews = reviewArray.map((review) => {
            if (review.id === updatedReview.id) {
                return updatedReview;
        } else {
            return review;
          }
        });
        setReviewArray(updatedReviews)
    //     console.log("Edit Complete:", updatedReview)
     }
    
    //function to log out by setting the state of the logged in user to undefined
     //and navigating back to the login page
    function logOut(){
        // setLoggedInUser(undefined)
        // navigate('/')
        fetch("/logout", {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                navigate('/')
                setLoggedInUser(null)
            }
        })
     }
    
    return(
        <div className="bar-info-page">

            <div className="header-div">
                <img className="header-logo" src={logo1} onClick={() => navigate('/home')}/>
                <div className="nav-bar">
                    <button type="button" onClick={() => navigate('/about')}> About</button>
                    <button type="button" onClick={() => navigate('/crawllist')}> View All Crawls</button>
                    <button type="button" onClick={() => navigate('/eventslist')}> View All Events</button>
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={loggedInUser ? logOut : () => navigate('/')}> Exit</button>
                </div>
            </div>

            {/* info about the bar */}
            <div className="bar-info-container">
                    <h1 className="bar-info-name">{clickedBar.name}</h1>
                    <img className="bar-info-image" src={clickedBar.image} alt={clickedBar.name}/>
                    {/* <h2 className="bar-info-rating">{clickedBar.rating}</h2> */}
            <div className="details-reviews-container">
                <div className="bar-info-details">
                    <h2 className="bar-info-category">{clickedBar.category}</h2>
                    <h2 className="bar-info-location">{clickedBar.location}</h2>
                    <h2 className="bar-info-price">{clickedBar.price}</h2>
                    <h2 className="bar-info-closing-time">Closing Time: {(clickedBar.closing_time)}</h2>
                </div>
                {/* show all of the reviews for this bar */}
                <div className="bar-reivew-container">
                    <h3 id="reviews">Reviews</h3>
                    <div className="scroll-reviews">
                    {filteredReviewArray.map((review) => {
                        return (
                            <BarReviewCard                        
                                review={review}                        
                            />
                            )
                        })}

                    </div>
                </div>
            </div>    
            </div>
            {/* form to write a review */}
            <div className="write-a-review-container">

            <BarReviewForm clickedBar={clickedBar} loggedInUser={loggedInUser} reviewArray={reviewArray} setReviewArray={setReviewArray}/>

            </div>
            <br></br>
            {/* 
            
            DELETE THIS BLOCK BC IT IS A DUPLICATE OF CONTENT RENDERED ABOVE

            show all of the reviews for this bar
            <div className="bar-reivew-container">
                {filteredReviewArray.map((review) => {
                    return (
                        <BarReviewCard                        
                            review={review}  
                            onUpdateReview={handleUpdateReview}                      
                        />
                        )
                    })}
            </div> */}
        </div>
    )
}


// function convert24to12(time) {
//     console.log(time.toString().length)

//     if (time.toString().length === 3){
//         let myFunc = num => Number(num);      
//         var intArr = Array.from(String(time), myFunc);

//         intArr.splice(1,0,":")
//         let newTime = intArr.toString()
//         console.log( newTime  )

//         let fourDigitTime = time.toString()
//         fourDigitTime = "0" + fourDigitTime
//         // console.log(parseInt(fourDigitTime))
//     } else {
//         var hours24 = parseInt(time.substring(0,2));
//         var hours = ((hours24 + 11) % 12) + 1;
//         var amPm = hours24 > 11 ? 'pm' : 'am';
//         var minutes = time.substring(2);

//         return hours + ':' + minutes + amPm;
//     }
// }




function BarReviewCard({review, onUpdateReview}){
    const [contentBody, setContentBody] = useState(review.content)
    const [starBody, setStarBody] = useState(review.star_rating)
    const  [toggleEdit, setToggleEdit]  = useState(false);

    const handleEditToggle = () => {
        setToggleEdit(!toggleEdit)
    }
    
    // const handleReviewEdit = (e) => {
    //     e.preventDefault();
        
    //     fetch(`/reviews/${review.id}`,{
    //         method: 'PATCH',
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             content: contentBody,
    //             star_rating: starBody
    //         })
    //     })
    //     .then((r) => r.json())
    //     .then((updatedReview) => onUpdateReview(updatedReview))
    // }       
    
    return(

        <div className="bar-review-card">
            <div className="review-author">{review.username}</div>
            <div className="review-rating">{review.star_rating}/5 Stars</div>
            <div className="review-rating">{review.content}</div>     
            {/* <button className="edit-button" onClick={handleEditToggle}>Edit</button>
            {toggleEdit ? <form className="edt-form" onSubmit={handleReviewEdit}>
                <input  
                    type="text"
                    name="star_rating"
                    value={starBody}
                    onChange={(e) => setStarBody(e.target.value)}
                    />
                <br></br>
                <input 
                    type="text"
                    name="content"
                    value={contentBody}
                    onChange={(e) => setContentBody(e.target.value)}
                    />
                <input type="submit" value="Save"/>
            </form> : null}     */}

            {/* {console.log(review.user?.username)}
            <button className="delete-button" onClick={(e) => {
                fetch(`/reviews/${review.id}`, {
                    method: "DELETE",
                })
                .then((r) => r.json())
                .then((deletedReview) => {
                    onUpdateReview(deletedReview)
                }),
                e.target.parentElement.remove()
            }}
            >Delete</button> */}
        </div>
    )
}

function BarReviewForm ({loggedInUser, reviewArray, setReviewArray, clickedBar}){
    //const [newReview, setNewReview] = useState([])
    const [reviewScore, setReviewScore] = useState("")
    const [reviewContent, setReviewContent] = useState("")
    const [errors, setErrors] = useState("")

    const postReview = async () =>{


        const reviewObject = {
            star_rating: reviewScore,
            content: reviewContent,
            user_id: loggedInUser.id,
            bar_id: clickedBar.id
        }

        fetch("/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewObject)
        }).then ((r) => {
            if (r.ok) {
                r.json().then ((review) => setReviewArray([...reviewArray, review]))
            } else {
                r.json().then(json => setErrors(json.errors))
            }
        })


    }

        return(

            <div className="review-form-div">
                <h3 className="write-a-review-title">Write a Review</h3>
                <h5>By {loggedInUser.username}</h5>
                <form className="write-a-review-form" onSubmit={(e) => {
                    e.preventDefault();
                    postReview()
                }}>
                    {/*  <h3 className="write-a-review-title">Write a Review</h3>
                    <h5> {loggedInUser ? `By ${loggedInUser.username}` : "Please Login to Post a Review"}</h5>  */}
                    <input id="rating" fluid placeholder="Rating out of 5" onChange={(e) => setReviewScore(e.target.value)}/>
                    <input id="review-content" fluid placeholder="Content" onChange={(e) => setReviewContent(e.target.value)}/>
                    <button id="submit-review" type="submit">Post Review</button>
                    {errors ? <div>{errors}</div>:null}
                </form>
            </div>
        )
    }


