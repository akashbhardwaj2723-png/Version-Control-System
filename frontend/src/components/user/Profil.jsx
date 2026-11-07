
import React, { useEffect, useState } from "react";
import "./Profile.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";


export default function Profile() {

  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const  { setCurrUser }   = useAuth();
  
  const [userDetails, setUserDetails] = useState({
    name: "userName"
  });

  useEffect(() => {
    const fatchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const responce = await axios.get(`http://localhost:8080/userProfile/${userId}`)
          console.log(responce.data);

          setUserDetails(responce.data);

        } catch (err) {
          console.error("Can Not Fatch User Datails:", err.message);

        }
      }
    }
    fatchUserDetails();
  }, [])

  return (
    <div className="profile-page">

      {/* Navbar */}
      <nav className="profile-navbar">

        <Link to="/">
          <div className="github-logo">
            <img src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" />
            <h3>GitHub</h3>
          </div>
        </Link>

        <div className="profile-nav-links">
          <a href="/create">Create a Repository</a>
          <a href="/profile">Profile</a>
        </div>

      </nav>

      {/* Tabs */}
      <div className="profile-tabs">

        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          ◫ Overview
        </button>

        <button
          className={activeTab === "starred" ? "active" : ""}
          onClick={() => setActiveTab("starred")}
        >
          ♙ Starred Repositories
        </button>
        <button className="LogOut"style={{backgroundColor:"rebeccapurple" ,}}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrUser(null);
          window.location.href = "/auth"
        }}
          >
          LogOut
        </button>
      </div>


      {/* Profile Details */}
      {/* Profile Details */}
      <div className="profile-content">

        <div className="PrfImg">
          <div className="profile-avatar">
            <img src="./profImg.jpeg" alt="Profile" />
          </div>

          <h2>{userDetails.userName}</h2>

          <button
            className="follow-btn"
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          <div className="followers-info">
            <span>10 Followers</span>
            <span>3 Following</span>
          </div>
        </div>

        {/* HeatMap */}
        <div className="heap-map">
          <HeatMapProfile />
        </div>

        {/* Tab Content */}
        <div className="profile-tab-content">
          {activeTab === "overview" ? (
            <div>
              <h3>Overview</h3>
              <p>Welcome to my GitHub Profile.</p>
            </div>
          ) : (
            <div>
              <h3>Starred Repositories</h3>
              <p>No starred repositories yet.</p>
            </div>
          )}
        </div>

      </div>


    </div>
  );
}
