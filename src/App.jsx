import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import CreateEventsPage from "./components/CreateEventsPage";
import EventsList from "./components/EventsList";
import LoginPage from "./components/LoginPage";
import CrawlList from "./components/CrawlList";
import EventPage from "./components/EventPage";
import NewCrawl from "./components/NewCrawl";
import { useState, useEffect } from "react";
import NewUser from "./components/NewUser";
import BarInfo from "./components/BarInfo";
import Account from "./components/Account";
import About from "./components/About";
import Home from "./components/Home";


function App() {

  //global states that sibiling compnenets may need to access
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [clickedBar, setClickedBar] = useState()
  const [barCrawlData,  setBarCrawlData] = useState() 
  const [priceFilter, setPriceFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");

  // useEffect for auto-login
  useEffect(() => {
    fetch("/me")
    .then((r) => {
      if (r.ok) {
        r.json().then((user) => setLoggedInUser(user));
      }
    });
  },[]);

  if(!setLoggedInUser)  return <LoginPage setLoggedInUser={setLoggedInUser} />


  //all the routes
  const router = createBrowserRouter([
    {
      path: "*",
      element: <div><h1>404 NOT FOUND</h1></div>
    },{
      path:"/",
      element: <LoginPage
        setLoggedInUser={setLoggedInUser}
      />
    },{
      path: "/newuser",
      element: <NewUser 
        loggedInUser={loggedInUser} 
        setLoggedInUser={setLoggedInUser}
      />
    },{
      path: "/home",
      element: <Home
        setClickedBar={setClickedBar}
        setBarCrawlData={setBarCrawlData}
        setLoggedInUser={setLoggedInUser}
        loggedInUser={loggedInUser}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />
    },{
      path: "/about",
      element: <About/>
    },{
      path:"/barinfo",
      element: <BarInfo
        clickedBar={clickedBar}
        loggedInUser={loggedInUser}
      />
    },{
      path: "/account",
      element: <Account
        loggedInUser={loggedInUser}
        
      />
    },{
      path: "/newcrawl",
      element: <NewCrawl
        barCrawlData={barCrawlData}
        loggedInUser={loggedInUser}
      />
    },{
      path: "/crawllist",
      element: <CrawlList
        setLoggedInUser={setLoggedInUser}
        loggedInUser={loggedInUser}
      />
    },{
      path: "/eventslist",
      element: <EventsList
        setLoggedInUser={setLoggedInUser}
        loggedInUser={loggedInUser}
      />
    },{
      path: "/createeventspage",
      element: <CreateEventsPage
        loggedInUser={loggedInUser}
      />
    },{
      path: "/eventpage",
      element: <EventPage
        loggedInUser={loggedInUser}
      />
    }
  ])
  return (


    <div >
        <head>
          <title>Baro</title>
        </head>
      <RouterProvider router={router}/>      
    </div>
  )
}

export default App

