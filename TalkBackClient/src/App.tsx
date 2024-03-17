import "./App.css";
import LoginPage from "./features/Auth/Login";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/auth-context";

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
        <LoginPage />
      </AuthContext.Provider>
    </>
  );
}

export default App;
