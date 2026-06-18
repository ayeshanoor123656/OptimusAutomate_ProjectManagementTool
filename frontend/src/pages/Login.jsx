import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const loginUser = async () => {

    const response = await axios.post(
      "http://127.0.0.1:8000/login",
      {
        email,
        password
      }
    );

    if(response.data.message==="Login Successful"){
      navigate("/dashboard");
    }else{
      alert(response.data.message);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>TaskFlow</h1>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <button
          className="auth-btn"
          onClick={loginUser}
        >
          Login
        </button>

        <div className="link">
          <Link to="/register">
            Create Account
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;