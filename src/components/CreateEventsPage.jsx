import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Form } from "semantic-ui-react"


export default function CreateEventsPage({loggedInUser}){

    const navigate = useNavigate()
    //get the info of the crawl from the prevous page
    const {state} = useLocation()
    let crawl = state.crawl

    console.log(crawl)

    return (
        <div>
            <h1>Event based on {crawl.bar_crawl_name}</h1>
            <EventForm 
                loggedInUser={loggedInUser}
            />
        </div>
    )
}

function postEvent(){
    console.log("post event")
}

function EventForm ({loggedInUser}){

    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")

    return (
        <div>
            <Form onSubmit={(e) => {
                e.preventDefault();
                postEvent()
            }}>
                <h2>Add Event Details</h2>
                <h3>Hosted by: {loggedInUser.real_name}</h3>
                <Form.Input fluid placeholder="Event Name" onChange={(e) => setEventName(e.target.value)}/>
                <Form.Input fluid placeholder="Event Description" onChange={(e) => setEventDescription(e.target.value)}/>
                <div>
                    <h4>Invite friends</h4>
                    <div>FREINDS LIST COMPONENT GOES HERE</div>
                </div>
                <br></br>
                <Form.Button type="submit">Create Event</Form.Button>
            </Form>
        </div>
    )
}
