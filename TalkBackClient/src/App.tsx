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
import ChatTemp from "./features/Chat/ChatTemp";

function App() {
  const { token, login, logout, userId, username } = useAuth();
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
        <Router>
          <Routes>
            {!token ? (
              <>
                <Route path="/auth" element={<AuthComponent />} />
                <Route path="*" element={<Navigate to="/auth" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<HomePage />} />
              </>
            )}
            <Route path="/chatdev" element={<ChatTemp />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>{" "}
      </AuthContext.Provider>
    </>
  );
}

export default App;
