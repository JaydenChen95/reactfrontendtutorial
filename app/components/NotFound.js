import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

function NotFound() {
  return (
    <Page title="Error">
      <div className="text-center">
        <h2>Post cannot be found.</h2>
        <p className="lead text-muted">
          Click here to return to <Link to="/">homepage</Link>
        </p>
      </div>
    </Page>
  )
}

export default NotFound
