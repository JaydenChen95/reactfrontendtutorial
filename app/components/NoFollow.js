import React, { useEffect, useContext } from "react"
import StateContext from "../StateContext"

function NoFollow(props) {
  const appState = useContext(StateContext)

  return (
    <div className="text-center">
      {appState.user.username == props.username ? `You do not have any ${props.action} yet.` : `This user does not have any ${props.action} yet. `}
      {props.action == "followers" && appState.user.username != props.username && `Be their first follower!`}
    </div>
  )
}

export default NoFollow
