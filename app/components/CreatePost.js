import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { withRouter } from "react-router-dom"
// with router is to pass in the default properties of a router
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import HomeGuest from "./HomeGuest"

function CreatePost(props) {
  const [title, setTitle] = useState()
  const [body, setBody] = useState()
  //const { addFlashMessage, setLoggedIn } = useContext(ExampleContext)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/create-post", { title, body, token: appState.user.token })
      //addFlashMessage("Congrats, you have successfully created a post!")
      //new
      appDispatch({ type: "flashMessage", value: "Congrats, you have created a new post!" })

      // redirect to ViewSinglePost URL (use withRouter)
      props.history.push(`/post/${response.data}`)
      console.log("New post created")
    } catch (err) {
      console.log("There was an error")
    }
  }

  if (!appState.loggedIn) {
    props.history.push("/")
    return <HomeGuest />
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input required onChange={e => setTitle(e.target.value)} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={e => setBody(e.target.value)} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  )
}

export default withRouter(CreatePost)
