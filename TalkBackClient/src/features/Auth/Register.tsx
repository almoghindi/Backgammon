import React, { FormEvent, useContext, useState } from "react";
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

export default function Register() {
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [error, setError] = useState("");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to retrieve user inputs
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const verifiedPassword = formData.get("verified-password") as string;

    if (verifiedPassword !== password) {
      setError("passwords do not match");
      return;
    } else {
      setError("");
    }

    const handleRegister = async () => {
      try {
        const responseData = await sendRequest<LoginResponse>(
          `http://localhost:3001/api/users/register`,
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
        console.log(err);
      }
    };

    handleRegister();
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
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            name="username"
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Verify Password"
            type="password"
            variant="outlined"
            name="verified-password"
            fullWidth
            margin="normal"
            sx={{ backgroundColor: "#FFF" }}
          />
          <div>
            {error !== "" && (
              <Typography color={"#f44336"} sx={{ padding: 0 }}>
                {error}
              </Typography>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </>
  );
}
