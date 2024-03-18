import React, { FormEvent, useContext } from "react";
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
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const { usernameError, passwordError, isLoginFormValid, error, setError } =
    useAuthValidations();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Using FormData to retrieve user inputs
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!isLoginFormValid(username, password)) return;

    // console.log({ username, password });
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
            fullWidth
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
      </Box>
    </>
  );
};

export default LoginPage;
