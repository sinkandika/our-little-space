import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AdminLayout from "./layouts/AdminLayout";
import KitchenLayout from "./layouts/KitchenLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import MenuManager from "./pages/admin/MenuManager";
import Menus from "./pages/admin/Menus";
import UserLayout from "./layouts/UserLayout";
import MyOrder from "./pages/user/MyOrder";
import MenuPage from "./pages/user/MenuPage";
import OptionManager from "./pages/admin/OptionManager";
import TrackOrder from "./pages/user/TrackOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
        path="/" 
        element={<Navigate to="/landingPage" replace />} 
        />

        {/* LANDING PAGE */}
        <Route
        path="/landingPage"
        element={<LandingPage />}
        />

        {/* LOGIN */}
        <Route
        path="/login"
        element={<Login />}
        />

        {/* USER */}
        <Route
        path="/table/:tableNumber"
        element={<UserLayout />}
        >
          <Route index element={<Navigate to="menu" replace />} />

          <Route 
          path="menu"
          element={<MenuPage />}
          />

          <Route
          path="my-order"
          element={<MyOrder />} 
          />

          <Route
          path="track-order"
          element={<TrackOrder />}
          />
        </Route>

        {/* KITCHEN */}
        <Route
        path="/kitchen"
        element= {
          <ProtectedRoute role="kitchen">
            <KitchenLayout />
          </ProtectedRoute>
        }
        >
        <Route index element={<Navigate to="/kitchen/dashboard" replace />} />
        
        <Route
        path="dashboard"
        element={<KitchenDashboard />} 
        />

        </Route>

        {/* ADMIN*/}
        <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />

          <Route
          path="dashboard"
          element={<AdminDashboard />}
          />

          <Route
          path="menus"
          element={<Menus />}
          />

          <Route
          path="menu-manager"
          element={<MenuManager />} 
          />

          <Route
          path="option-manager"
          element={<OptionManager />}
          />

        </Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App;