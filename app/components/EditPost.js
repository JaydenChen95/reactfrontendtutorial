import React, { useEffect, useState, useContext } from "react"
import { useImmerReducer } from "use-immer"
import Page from "./Page"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import NotFound from "./NotFound"
import HomeGuest from "./HomeGuest"

function EditPost(props) {
  const initState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  }

  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "titleChange":
        draft.title.value = action.value
        draft.title.hasErrors = false
        return
      case "bodyChange":
        draft.body.value = action.value
        draft.body.hasErrors = false
        return
      case "submitRequest":
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount = draft.sendCount + 1
        }
        return
      case "saveRequestStarted":
        draft.isSaving = true
        return
      case "saveRequestFinished":
        draft.isSaving = false
        return
      case "titleValidate":
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = "You must provide a title!"
        }
        return
      case "bodyValidate":
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = "You must provide a body!"
        }
        return
      case "notFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initState)

  function submitHandler(e) {
    e.preventDefault()
    dispatch({ type: "titleValidate", value: state.title.value })
    dispatch({ type: "bodyValidate", value: state.title.value })
    dispatch({ type: "submitRequest" })
  }

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const getPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        console.log(response.data)
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission" })
            //redirect to homepage
            props.history.push("/")
          }
        } else {
          dispatch({ type: "notFound" })
        }
      } catch {
        console.log("There was an error")
      }
    }
    getPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" })
      const sendPost = async () => {
        try {
          await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token })
          dispatch({ type: "saveRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post Updated" })
        } catch {
          console.log("There was an error")
        }
      }
      sendPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="....">
        <LoadingDotsIcon />
      </Page>
    )

  if (!appState.loggedIn) {
    props.history.push("/")
    return <HomeGuest />
  }

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo;Back to post
      </Link>
      <form className="mt-3" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={e => dispatch({ type: "titleValidate", value: e.target.value })} onChange={e => dispatch({ type: "titleChange", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" value={state.title.value} />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: "bodyValidate", value: e.target.value })} onChange={e => dispatch({ type: "bodyChange", value: e.target.value })} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" value={state.body.value} />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Update Post
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
