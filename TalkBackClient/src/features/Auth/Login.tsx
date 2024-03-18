import React, { FormEvent, useContext, useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { AuthContext } from "../../context/auth-context";
import { AxiosError } from "axios";
import useAuthValidations from "../../hooks/useAuthValidations";

interface LoginResponse {
  userId: string;
  token: string;
  refreshToken: string;
  username: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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

  const { usernameError, passwordError, isLoginFormValid, error, setError } =
    useAuthValidations();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Using FormData to retrieve user inputs
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!isLoginFormValid(username, password)) return;

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
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
        } else {
          setError("Login failed");
        }
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
            error={usernameError !== ""}
            helperText={usernameError}
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
            error={passwordError !== ""}
            helperText={passwordError}
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          {error !== "" && (
            <Typography color={"#f44336"} sx={{ padding: 0 }}>
              {error}
            </Typography>
          )}
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
