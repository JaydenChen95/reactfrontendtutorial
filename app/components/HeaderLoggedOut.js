import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"

function HeaderLoggedOut(props) {
  //const { addFlashMessage, setLoggedIn } = useContext(ExampleContext)
  const appDispatch = useContext(DispatchContext)

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await Axios.post("/login", { username, password })
      if (res.data) {
        // localStorage.setItem("complexAppToken", res.data.token)
        // localStorage.setItem("complexAppUsername", res.data.username)
        // localStorage.setItem("complexAppAvatar", res.data.avatar)
        appDispatch({ type: "login", data: res.data })
      } else {
        appDispatch({ type: "flashMessage", value: "Invalid Username or Password." })
        //console.log("Invalid username and password")
      }
    } catch (e) {
      console.log("there was an error")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        <div className="col-md-auto">
          <button type="submit" className="btn btn-success btn-sm">
            Sign In
          </button>
        </div>
      </div>
    </form>
  )
}

export default HeaderLoggedOut
