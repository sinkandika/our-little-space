import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard () {

const { user, logout } = useAuth();
const navi = useNavigate();

// HANDLE LOGOUT
const handleLogout = () => {
  logout();
  navi("/login");
}

  return (
    <div>
      <p>welcome {user?.name} to admin dashboard</p>
      <button onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};
export default AdminDashboard;