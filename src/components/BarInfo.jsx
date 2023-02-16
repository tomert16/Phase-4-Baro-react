// import { CoPresentSharp } from "@mui/icons-material";
import { useState,  useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Form } from "semantic-ui-react";
import logo1 from './assets/cropped-logo1.png'


export default function BarInfo({clickedBar, loggedInUser, setLoggedInUser}){

    
    const navigate = useNavigate()
    if ( clickedBar === undefined) {navigate('/home')}

    //states used
    const [reviewArray, setReviewArray] = useState([])

    useEffect(() => {
        

       const fetchReviews = async () => {
           const req = await fetch('http://localhost:3000/reviews')
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
        fetch("http://localhost:3000/logout", {
            method: "DELETE",
        }).then((r) => {
            if (r.ok) {
                setLoggedInUser(null)
                navigate('/')
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
                    <button type="button" onClick={() => navigate('/account')}> Account Info</button>
                    <button type="button" onClick={logOut}> Exit</button>
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
                    <h2 className="bar-info-closing-time">Closing Time: {clickedBar.closing_time}</h2>
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
        </div>
    )
}





function BarReviewCard({review}){
    // const [contentBody, setContentBody] = useState(review.content)
    // const [starBody, setStarBody] = useState(review.star_rating)
    // const  [toggleEdit, setToggleEdit]  = useState(false);

    // const handleEditToggle = () => {
    //     setToggleEdit(!toggleEdit)
    // }
    
    // const handleReviewEdit = (e) => {
    //     e.preventDefault();
        
    //     fetch(`http://localhost:3000/reviews/${review.id}`,{
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
            <div className="bar-review-body">{review.content}</div>     
            {/* <button className="edit-button" onClick={handleEditToggle}>Edit</button>  */}
            {/* {toggleEdit ? <form className="edt-form" onSubmit={handleReviewEdit}>
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
                fetch(`http://localhost:3000/reviews/${review.id}`, {
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

    const postReview = async () =>{
    // const newReviewContent = {
    //     star_rating: reviewScore,
    //     content: reviewContent
    // }


        const reviewObject = {
            star_rating: reviewScore,
            content: reviewContent,
            user_id: loggedInUser.id,
            bar_id: clickedBar.id
        }

       const req = await fetch("http://localhost:3000/reviews",{
            method: 'POST',
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewObject)
        })
        const resp = await req.json()
        setReviewArray([...reviewArray, resp])

    }
    //if there is no user logged in, show a message
    if(loggedInUser === undefined){
        return(

            <div className="review-no-login"> Please Login to Post a Review </div>
        )

    }else{
        return(
            <div>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    postReview()
                }}>
                    <h3 className="write-a-review-title">Write a Review</h3>
                    <h5>By {loggedInUser.username}</h5>
                    <Form.Input id="rating" fluid placeholder="Rating out of 5" onChange={(e) => setReviewScore(e.target.value)}/>
                    <Form.Input id="review-content" fluid placeholder="Content" onChange={(e) => setReviewContent(e.target.value)}/>
                    <Form.Button id="submit-review" type="submit">Post Review</Form.Button>
                </Form>
            </div>
        )
    }

}