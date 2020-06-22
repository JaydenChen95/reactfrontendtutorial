import React, { useEffect, useState } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import NoFollow from "./NoFollow"

function ProfileFollow(props) {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const getPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, { cancelToken: ourRequest.token }) //third argument for a post request
        //console.log(response.data)
        setPosts(response.data)
        setIsLoading(false)
      } catch {
        console.log("There was an error")
      }
    }
    getPosts()

    //clean up function (to stop the response from sending back after being cancelled)
    return () => {
      ourRequest.cancel()
    }
  }, [props.action])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
          </Link>
        )
      })}
      {!posts.length && <NoFollow action={props.action} username={username} />}
    </div>
  )
}

export default ProfileFollow
