import "./App.css";
import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/auth-context";
import AuthComponent from "./pages/Auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthComponent />,
  },
]);

function App() {
  const { token, login, logout, userId, username } = useAuth();
  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          userId,
          token,
          username,
          login,
          logout,
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
