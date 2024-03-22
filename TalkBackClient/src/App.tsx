import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthComponent from "./pages/Auth";
import HomePage from "./pages/Home";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/auth-context";
import { useOnlineUsers } from "./hooks/useOnlineUsers";
import { OnlineUsersContext } from "./context/online-users-context";
function App() {
  const { token, login, logout, userId, username } = useAuth();
  const { onlineUsers, addOnlineUser, removeOnlineUser } = useOnlineUsers();
  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          userId: userId,
          token: token,
          username: username,
          login: login,
          logout: logout,
        }}
      >
        <OnlineUsersContext.Provider
          value={{
            onlineUsers: onlineUsers,
            addOnlineUser: addOnlineUser,
            removeOnlineUser: removeOnlineUser,
          }}
        >
          <Router>
            <Routes>
              {!token ? (
                <>
                  <Route path="/auth" element={<AuthComponent />} />
                  <Route path="*" element={<Navigate to="/auth" />} />
                </>
              ) : (
                <Route path="/" element={<HomePage />} />
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>{" "}
        </OnlineUsersContext.Provider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
