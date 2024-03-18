import { FormEvent } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useNavigate } from "react-router";
import useRegisterValidations from "../../hooks/useRegisterValidations.tsx";

interface RegisterResponse {
  message: string;
}

export default function Register() {
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const {
    error,
    usernameError,
    passwordError,
    verifiedPasswordError,
    isRegisterFormValid,
    setError,
  } = useRegisterValidations();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to retrieve user inputs
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const verifiedPassword = formData.get("verified-password") as string;

    if (!isRegisterFormValid(username, password, verifiedPassword)) {
      return;
    }

    const handleRegister = async () => {
      try {
        const responseData = await sendRequest<RegisterResponse>(
          `http://localhost:3001/api/users/register`,
          "POST",
          {
            username,
            password,
          }
        );
        if (!responseData) {
          throw new Error("Register failed");
        }
        localStorage.setItem("userName", username);
        navigate(`/auth?type=login`);
      } catch (err) {
        setError("Registration failed");
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
            error={usernameError !== ""}
            helperText={usernameError}
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            fullWidth
            margin="normal"
            error={passwordError !== ""}
            helperText={passwordError}
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Verify Password"
            type="password"
            variant="outlined"
            name="verified-password"
            fullWidth
            margin="normal"
            error={verifiedPasswordError !== ""}
            helperText={verifiedPasswordError}
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
              Register
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
}
