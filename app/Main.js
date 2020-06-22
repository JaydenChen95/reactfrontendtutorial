import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Axios from "axios"
Axios.defaults.baseURL = process.env.BACKENDURL || "https://complexreacttutorial.herokuapp.com"
import { CSSTransition } from "react-transition-group"

//components
import LoadingDotsIcon from "./components/LoadingDotsIcon"
import Header from "./components/Header.js"
import Footer from "./components/Footer.js"
import HomeGuest from "./components/HomeGuest.js"
import About from "./components/About.js"
import Terms from "./components/Terms.js"
import Home from "./components/Home"
const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexAppToken"),
      username: localStorage.getItem("complexAppUsername"),
      avatar: localStorage.getItem("complexAppAvatar")
    },
    isSearchOpened: false,
    isChatOpened: false,
    unreadChatCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
        draft.isSearchOpened = true
        return
      case "closeSearch":
        draft.isSearchOpened = false
        return
      case "toggleChat":
        draft.isChatOpened = !draft.isChatOpened
        return
      case "closeChat":
        draft.isChatOpened = false
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount = draft.unreadChatCount + 1
        return
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexAppToken", state.user.token)
      localStorage.setItem("complexAppUsername", state.user.username)
      localStorage.setItem("complexAppAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexAppToken")
      localStorage.removeItem("complexAppUsername")
      localStorage.removeItem("complexAppAvatar")
    }
  }, [state.loggedIn])

  // const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("complexAppToken")))
  // const [flashMessages, setFlashMessages] = useState([])

  // function addFlashMessage(message) {
  //   setFlashMessages(prev => {
  //     //console.log(prev)
  //     return prev.concat(message)
  //   })
  // }

  //check if token exists on first render
  useEffect(() => {
    if (state.loggedIn) {
      // Send request to backend
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Sessions expired. Please login again." })
          }
        } catch (err) {
          console.log("there was an error")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/about-us">
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition timeout={330} in={state.isSearchOpened} classNames="search-overlay" unmountOnExit>
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

ReactDOM.render(<Main />, document.querySelector("#app"))

if (module.hot) {
  module.hot.accept()
}
