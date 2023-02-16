import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NewCrawl({barCrawlData}){

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
            <h1>Here you can see the bars in your crawl</h1>
            <button type="button" onClick={() => navigate('/home')}> Home </button>
            {barCrawlArray.map((bar) => {
                //udpate the number of the bar in the crawl
                barCrawlNumber += 1
                return(
                    <CrawlBar bar={bar} barCrawlNumber={barCrawlNumber} totalCrawlBars={totalCrawlBars}/>
                )
            })}
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
