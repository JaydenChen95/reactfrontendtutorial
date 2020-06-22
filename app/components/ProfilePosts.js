import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Post from "./Post"
import StateContext from "../StateContext"

function ProfilePosts() {
  const appState = useContext(StateContext)
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const getPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token }) //third argument for a post request
        console.log(response.data)
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
  }, [username])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {!posts.length && appState.user.username == username && <div className="text-center mb-3">You do not have any post yet.</div>}
      {!posts.length && appState.user.username != username && <div className="text-center mb-3">This user does not have any post yet.</div>}
      {posts.map(post => {
        return <Post noAuthor={true} post={post} key={post._id} />
      })}
    </div>
  )
}

export default ProfilePosts
