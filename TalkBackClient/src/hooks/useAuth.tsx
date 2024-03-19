import { useState, useCallback, useEffect } from "react";
import axios from "axios";
let logoutTimer: ReturnType<typeof setTimeout>;

interface UserAuthData {
  userId: string;
  token: string;
  refreshToken: string;
  expiration: string;
  username: string;
}
export const useAuth = () => {
  const [token, setToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const login = useCallback(
    async (
      uid: string,
      token: string,
      refreshToken: string,
      username: string
    ) => {
      await axios.post(
        "http://localhost:3004/api/users/online",
        {
          userId: uid,
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToken(token);
      setRefreshToken(refreshToken);
      setUserId(uid);
      setUsername(username);
      const tokenExpirationDate = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24
      );
      setTokenExpirationDate(tokenExpirationDate);
      const userData = {
        userId: uid,
        token: token,
        refreshToken: refreshToken,
        expiration: tokenExpirationDate.toISOString(),
        username: username,
      };

      if (localStorage.getItem("userName")) {
        localStorage.removeItem("userName");
      }
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    []
  );

  const logout = useCallback(() => {
    setToken("");
    setRefreshToken("");
    setTokenExpirationDate(null);
    setUserId("");
    setUsername("");
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedDataJSON = localStorage.getItem("userData");

    if (storedDataJSON) {
      const storedData: UserAuthData = JSON.parse(storedDataJSON);
      if (storedData && storedData.token && storedData.userId) {
        login(
          storedData.userId,
          storedData.token,
          storedData.refreshToken,
          // new Date(parsedData.expiration),
          storedData.username
        );
      }
    }
  }, [login]);

  useEffect(() => {
    if (token && refreshToken && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        axios
          .post(
            "http://localhost:3001/api/users/refresh",
            {
              refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const data = response.data;
            console.log(response.data);
            login(userId, data.token, refreshToken, username);
          })
          .catch((error) => console.error("Error refreshing token:", error));
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, refreshToken, tokenExpirationDate, login, logout]);

  return { token, login, logout, userId, username };
};
