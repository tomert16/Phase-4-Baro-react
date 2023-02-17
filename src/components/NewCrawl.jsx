import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "semantic-ui-react";

export default function NewCrawl({barCrawlData, loggedInUser}){

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

    return(
        <div>
            <button type="button" onClick={() => navigate('/home')}> Home </button>
            <h1>Here is what your new crawl looks like {loggedInUser.real_name}</h1>
            {barCrawlArray.map((bar) => {
                //udpate the number of the bar in the crawl
                barCrawlNumber += 1
                return(
                    <CrawlBar 
                        bar={bar} 
                        barCrawlNumber={barCrawlNumber} 
                        totalCrawlBars={totalCrawlBars}
                    />
                )
            })}
            <NewCrawlSaveForm 
                barCrawlString={barCrawlString} 
                barCrawlNameInput={barCrawlNameInput}
                setBarCrawlNameInput={setBarCrawlNameInput}
                loggedInUser={loggedInUser}
            />
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
        <div>
            <h3>
                {grammerForDisplayingCarwlBarSequence(barCrawlNumber, totalCrawlBars)} 
                {bar[0].name} at {bar[0].location}
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
        <div>
            <h1>Save your crawl</h1>
            <Form 
                className="review-form" 
                onSubmit={(e) => {
                    e.preventDefault()
                    handleReviewSubmit(barCrawlString, barCrawlNameInput, loggedInUser)
                }}
            >
                <Form.Input fluid 
                    placeholder="Crawl Name"
                    value={barCrawlNameInput}
                    autoComplete="off"
                    onChange={(e) => setBarCrawlNameInput(e.target.value)} 
                />
                <Form.Button type="submit">Save Crawl</Form.Button>
            </Form>
        </div>
    )
}
