import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function KitchenDashboard () {
  const { user, logout } = useAuth();
  const navi = useNavigate();

  // handle logoout
  const handleLogout = () => {
    logout();
    navi("/login");
  };

  return (
    <div>
      <p>welcome {user?.name} to kitchen dashboard</p>
      <button onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default KitchenDashboard;