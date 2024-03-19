import { FormEvent, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getRegisterValidation } from "../../utils/validations";
// import useAuthValidations from "../../hooks/useAuthValidations.tsx";
import { AxiosError } from "axios";

interface RegisterResponse {
  message: string;
}

export default function Register() {
  const [error, setError] = useState<string>("");
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to retrieve user inputs
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const verifiedPassword = formData.get("verified-password") as string;

    const error = getRegisterValidation(username, password, verifiedPassword);
    if (error) {
      setError(getRegisterValidation(username, password, verifiedPassword));
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
        if (err instanceof AxiosError) {
          setError(err.response?.data.message);
        } else {
          setError("Login failed");
        }
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
