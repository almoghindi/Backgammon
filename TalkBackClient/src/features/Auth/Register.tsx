import { FormEvent, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useHttpClient } from "../../hooks/useHttp";
import LoadingSpinner from "../../components/LoadingSpinner";
import { isValidPassword } from "../../utils/validations";
// import useAuthValidations from "../../hooks/useAuthValidations.tsx";

interface RegisterResponse {
  message: string;
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confrimPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const { isLoading, sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to retrieve user inputs
    // const formData = new FormData(event.currentTarget);
    // const username = formData.get("username") as string;
    // const password = formData.get("password") as string;
    // const verifiedPassword = formData.get("verified-password") as string;

    if (password !== confrimPassword) {
      setError("Passwords Should match");
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
            value={username}
            onChange={handleUsernameChange}
            fullWidth
            margin="normal"
            error={username.length < 3}
            helperText={"Username must be longer than 3 characters"}
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!isValidPassword(password)}
            helperText={
              "Password should include at least 8 characters, Upper and Lower case and number!"
            }
            sx={{ backgroundColor: "#FFF" }}
          />
          <TextField
            label="Verify Password"
            type="password"
            variant="outlined"
            name="verified-password"
            value={confrimPassword}
            onChange={handleConfirmPasswordChange}
            fullWidth
            margin="normal"
            // error={verifiedPasswordError !== ""}
            // helperText={verifiedPasswordError}
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
