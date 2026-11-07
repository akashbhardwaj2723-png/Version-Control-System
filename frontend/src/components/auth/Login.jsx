import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import "../../App.css";
import { useAuth } from "../../authContext";
const Login = () => {

  // useEffect(() => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("userId");
  //   setCurrUser(null)
  // },[])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const  { setCurrUser }   = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await axios.post("http://localhost:8080/login", {
      email: email,
      password: password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);

    setCurrUser(res.data.userId);

    setLoading(false);

    window.location.href = "/";

  } catch (err) {
    console.error(err);
    alert("Login Failed");
    setLoading(false);
  }
};
  return (
    <div className="main-container">
      <div className="header">
        <svg
          height="45"
          viewBox="0 0 24 24"
          width="45"
          fill="white"
        >
          <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.23-3.23-.12-.3-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
        </svg>

        <h1>Sign In</h1>
      </div>

      <form className="signup-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email address</label>
          <input type="email" autoCapitalize="off" required name="email" id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" required id="password" name="password"
            value={password}
              autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit"
        disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <div className="signin-box">
        <p>
          New to GitHub <Link to="/signup">Create an Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;