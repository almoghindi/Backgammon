import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button, Box } from "@mui/material";

export default function AuthComponent() {
  const [isLoginPage, setIsLogin] = useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const navigate = useNavigate();

  function toggle() {
    const query = isLoginPage ? "register" : "login";
    navigate(`/auth?type=${query}`);
  }

  useEffect(() => {
    if (type) {
      setIsLogin(type === "login");
      return;
    }
    setIsLogin(true);
  }, [type]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "15px",
          padding: "1.5em 1em",
          height: "50vh",
          backgroundColor: "#FFF",
        }}
      >
        {isLoginPage ? <Login /> : <Register />}
        <Button onClick={toggle} sx={{ m: 1 }}>
          {isLoginPage
            ? "Dont have a user ? Register now !"
            : "Already a user? Log in"}
        </Button>
      </Box>
    </>
  );
}
