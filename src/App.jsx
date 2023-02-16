import { useState, useEffect } from "react";
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import LoginPage from "./components/LoginPage"
import NewUser from "./components/NewUser"
import Home from "./components/Home";
import About from "./components/About";
import BarInfo from "./components/BarInfo";
import Account from "./components/Account";
import NewCrawl from "./components/NewCrawl";
import CrawlList from "./components/CrawlList";


function App() {

  //global states that sibiling compnenets may need to access
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [clickedBar, setClickedBar] = useState()
  const [barCrawlData,  setBarCrawlData] = useState() 

  // useEffect for auto-login
  useEffect(() => {
    fetch("http://localhost:3000/me")
    .then((r) => {
      if (r.ok) {
        r.json().then((user) => setLoggedInUser(user));
      } else {
        setLoggedInUser(null)
      }
    });
  },[]);


  //all the routes
  const router = createBrowserRouter([
    {
      path: "*",
      element: <div><h1>404 NOT FOUND</h1></div>
    },
    {
      path:"/",
      element: <LoginPage
        setLoggedInUser={setLoggedInUser}
      />
    },
    {
      path: "newuser",
      element: <NewUser 
        loggedInUser={loggedInUser} 
        setLoggedInUser={setLoggedInUser}
      />
    },
    {
      path: "/home",
      element: <Home
        setClickedBar={setClickedBar}
        setBarCrawlData={setBarCrawlData}
        setLoggedInUser={setLoggedInUser}
        loggedInUser={loggedInUser}
      />
    },
    {
      path: "/about",
      element: <About/>
    },
    {
      path:"/barinfo",
      element: <BarInfo
        clickedBar={clickedBar}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    },
    {
      path: "/account",
      element: <Account
        loggedInUser={loggedInUser}
      />
    },
    {
      path: "/newcrawl",
      element: <NewCrawl
        barCrawlData={barCrawlData}
        loggedInUser={loggedInUser}
      />
    },
    {
      path: "/crawllist",
      element: <CrawlList
        setLoggedInUser={setLoggedInUser}
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
