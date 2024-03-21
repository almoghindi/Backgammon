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
      setToken(token);
      setRefreshToken(refreshToken);
      setUserId(uid);
      setUsername(username);
      const tokenExpirationDate = new Date(
        new Date().getTime() + 1000 * 60 * 15
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

  const refresh = async (refreshToken: string): Promise<string> => {
    try {
      console.log(refreshToken);
      const response = await axios.post(
        "http://localhost:3001/api/users/refresh",
        { refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  };

  useEffect(() => {
    const storedDataJSON = localStorage.getItem("userData");

    if (storedDataJSON) {
      const storedData: UserAuthData = JSON.parse(storedDataJSON);
      if (storedData && storedData.token && storedData.userId) {
        const fetchData = async () => {
          const accessToken = await refresh(storedData.refreshToken);
          login(
            storedData.userId,
            accessToken,
            storedData.refreshToken,
            storedData.username
          );
        };
        fetchData();
      }
    }
  }, [login]);

  useEffect(() => {
    if (token && refreshToken && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => {
        refresh(refreshToken);
      }, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, refreshToken, tokenExpirationDate, login, logout]);

  return { token, login, logout, userId, username };
};
