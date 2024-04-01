import { useHttpClient } from "./useHttp";
import axios from "axios";
const AXIOS_TIMEOUT_MS = 5000;

const baseURL = "http://localhost:3003/api/game";

interface Response {
  success: boolean;
}

export async function joinGame(
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
    const response = await fetch(baseURL + "/join-game", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) throw new Error("failed to join game");
    // await sendRequest<ChatMessagesResponse>(
    //   baseURL + "/join-game",
    //   "POST",
    //   body,
    //   { authorization: `Bearer ${token}` }
    // );
    if (!response) throw new Error("fetch failed");
    const data = await response.json();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function requestEndGame(
  username: string,
  opponent: string,
  isWin: boolean,
  points: number
) {
  try {
    const response = await fetch(baseURL + "/end-game", {
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        isWin,
        points,
      }),
    });
    if (!response.ok) throw new Error("failed to end game");
  } catch (err) {
    console.error(err);
  }
}

export async function requestStartGame(
  username: string,
  opponent: string,
  gameObjectJson: string
) {
  try {
    const response = await fetch(baseURL + "/start-game", {
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: JSON.stringify({
        username,
        opponent,
        gameObject: gameObjectJson,
      }),
    });
    if (!response.ok) throw new Error("failed to start game");
  } catch (err) {
    console.error(err);
  }
}

export async function notifyChangeTurn(
  username: string,
  opponent: string,
  message: string
) {
  try {
    const response = await axios.post(
      baseURL + "/notify-change-turn",
      {
        username,
        opponent,
        message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response.status !== 200) throw new Error("failed to start game");
  } catch (err) {
    console.error(err);
  }
}

export async function requestUserSelect(
  username: string,
  opponent: string,
  json: string
) {
  try {
    const response = await axios.post(
      baseURL + "/select",
      {
        username,
        opponent,
        json,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        timeout: AXIOS_TIMEOUT_MS,
      }
    );
    if (response.status !== 200) throw new Error("failed to send select event");
    if (response) return true;
  } catch (err) {
    console.error(err);
    if (axios.isCancel(err)) {
      console.error("SELECT REQUEST TIMED OUT: ", err);
    }
    return false;
  }
}

export async function requestRollDice(
  username: string,
  opponent: string,
  turnJson: string
) {
  try {
    const response = await axios.post(
      `${baseURL}/roll-dice`,
      {
        username,
        opponent,
        turnJson,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to roll dice");
    }
  } catch (err) {
    console.error(err);
  }
}

export const getStartingPlayer = async (username: string, opponent: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/get-first-player`,
      {
        users: [username, opponent],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to get starting player");
    }
    return response.data.result;
  } catch (err) {
    console.error(err);
  }
};
