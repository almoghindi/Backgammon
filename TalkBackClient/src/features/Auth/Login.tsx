import React, { FormEvent, useContext, useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";

interface LoginResponse {
  userId: string;
  token: string;
  refreshToken: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const username: string | null = localStorage.getItem("userName");
    if (username) {
      setUsername(username);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const handleLogin = async () => {
      try {
        const responseData = await sendRequest<LoginResponse>(
          `http://localhost:3001/api/users/login`,
          "POST",
          {
            username,
            password,
          }
        );

        auth.login(
          responseData.userId,
          responseData.token,
          responseData.refreshToken,
          responseData.username
        );
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
          backgroundColor: "#F5F5DC",
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
            fullWidth
            required
            margin="normal"
            sx={{ backgroundColor: "#F5F5DC" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            required
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#F5F5DC" }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Login
          </Button>
        </form>
        {error && <Typography sx={{ color: "red" }}>{error}</Typography>}
      </Box>
    </>
  );
};

export default LoginPage;
