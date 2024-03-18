import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "@mui/material";

export default function AuthComponent() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  //   const { type } = useParams(); //login || register
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const navigate = useNavigate();

  function toggle() {
    const query = isLogin ? "register" : "login";
    navigate(`/auth?type=${query}`);
  }

  useEffect(() => {
    console.log("mounted " + type);
    if (type) {
      setIsLogin(type === "login");
      return;
    }
    setIsLogin(false);
  }, [type]);

  return (
    <>
      {isLogin ? <Login /> : <Register />}
      <Button onClick={toggle}>{isLogin ? "register" : "login"}</Button>
    </>
  );
}
