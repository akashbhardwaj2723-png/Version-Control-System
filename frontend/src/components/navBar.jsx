import React from "react";
import {Link} from"react-router-dom";
import "./navBar.css"
 const navBar = () => {
  return (
   <nav className="navBar">
    <Link to="/">
    <div>
      <img src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" />
      <h3>GitHub</h3>
    </div>
    </Link>
    <Link to="create">
    <p>+ create Repo</p>
    </Link>
    <Link to="/profile">
    <p>profile</p>
    </Link>
   </nav>
  )
}
export default navBar;