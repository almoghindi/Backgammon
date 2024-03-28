import React, { FormEvent, useContext, useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { onlineUsersSocket as socket } from "../../utils/socketConnection";
interface LoginResponse {
  userId: string;
  token: string;
  refreshToken: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const username: string | null = localStorage.getItem("userName");
    if (username) {
      setUsername(username);
    }
  }, []);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const handleLogin = async () => {
      try {
        const loginResponseData = await sendRequest<LoginResponse>(
          `http://localhost:3001/api/users/login`,
          "POST",
          {
            username,
            password,
          }
        );

        await sendRequest<LoginResponse>(
          `http://localhost:3004/api/users/online`,
          "POST",
          {
            userId: loginResponseData.userId,
            username: loginResponseData.username,
          }
        );
        auth.login(
          loginResponseData.userId,
          loginResponseData.token,
          loginResponseData.refreshToken,
          loginResponseData.username
        );

        socket.emit("user-logged-in", username);
      } catch (err) {
        setError("Authentication Failed, please try again.");
      }
    };

    handleLogin();
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          backgroundColor: "#FFF",
        }}
      >
        <Typography variant="h4" sx={{ color: "#8B4513", mb: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            required
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          <div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, width: "25%" }}
            >
              Login
            </Button>
          </div>
        </form>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </Box>
    </>
  );
};

export default LoginPage;
