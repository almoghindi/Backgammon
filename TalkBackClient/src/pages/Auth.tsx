import { Login } from "@mui/icons-material";
import Register from "../features/Auth/Register";
import { useState } from "react";

export default function AuthComponent(){
    const [isLogin, setIsLogin] = useState(false);
    return (
        <>
        {isLogin ? <Login /> : <Register />}
        </>
    )
}