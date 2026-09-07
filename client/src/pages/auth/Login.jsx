import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navi = useNavigate();

  // HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser({
        email,
        password,
      });

      // auth context
      login(result.token, result.user);

      alert("Login success :)");
      
      if (result.user.role === "admin") {
        navi("/admin");
      } else {
        navi("/kitchen")
      }

    } catch (err) {
      alert (err.response?.data?.message || "Login failed :(");
    }
  };

  return (
    <div>
      <p>Kitchen Login</p>

      <form onSubmit={handleLogin}>
        <p>email</p>
        <input 
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        />
        <p>password</p>
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button 
        type="submit"
        className="border"
        >
          Login
        </button>

      </form>
    </div>
  );
};

export default Login