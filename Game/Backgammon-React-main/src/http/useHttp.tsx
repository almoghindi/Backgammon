import { useState, useCallback, useRef, useEffect, useContext } from "react";
import axios, {
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosError,
} from "axios";

interface UserAuthData {
  userId: string;
  token: string;
  refreshToken: string;
  expiration: string;
  username: string;
}

const baseURL = "http://localhost:3003/api/game";

interface HttpClientHook {
  isLoading: boolean;
  error: string | null;
  sendRequest: <T>(
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body?: Record<string, unknown> | null,
    headers?: Record<string, string>
  ) => Promise<T>;
  clearError: () => void;
  joinGame: (username: string, opponent: string, socketId: string | undefined) => Promise<boolean>;
}

export const useHttpClient = (): HttpClientHook => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  useEffect(() => {
    if(!token) setError("Not authorized. Please log in.");
  }, []);

  const activeHttpRequests = useRef<CancelTokenSource[]>([]);

  const sendRequest = useCallback(
    async <T,>(
      url: string,
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
      body: Record<string, unknown> | null = null,
      headers: Record<string, string> = {}
    ): Promise<T> => {
      setIsLoading(true);
      const httpAbortCtrl = axios.CancelToken.source();
      activeHttpRequests.current.push(httpAbortCtrl);

      headers["Authorization"] = token ? `Bearer ${token}` : "";

      try {
        const axiosRequestConfig: AxiosRequestConfig = {
          method,
          url,
          data: body,
          headers,
          cancelToken: httpAbortCtrl.token,
        };
        const response = await axios(axiosRequestConfig);

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        setIsLoading(false);
        return response.data;
      } catch (err) {
        const error = err as AxiosError; // Properly type axios error
        setError(error.message);
        setIsLoading(false);
        throw err;
      }
    },
    [token]
  );

  const clearError = () => {
    setError(null);
  };

  async function joinGame(
    username: string,
    opponent: string,
    socketId: string | undefined
  ): Promise<boolean> {
    try {
      if (socketId === undefined) false;
      const body = {
        username,
        opponent,
        socketId,
      };
      const response =  await sendRequest(
          baseURL + "/join-game",
          "POST",
          body,
          { authorization: `Bearer ${token}` }
        );
      if (!response) throw new Error("failed to join game");
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }


  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) =>
        abortCtrl.cancel("React component unmounted.")
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError, joinGame };
};
