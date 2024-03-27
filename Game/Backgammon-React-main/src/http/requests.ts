export async function joinGame(
  username: string,
  opponent: string,
  socketId: string | undefined
) {
  try {
    if (socketId === undefined) return;
    const body = {
      username,
      opponent,
      socketId,
    };
    const response = await fetch("http://localhost:3003/api/game/join-game", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) console.error(response);
  } catch (err) {
    console.error(err);
  }
}

export const getStartingPlayer = async (username: string, opponent: string) => {
  try {
    const response = await fetch(
      `http://localhost:3003/api/game/get-first-player`,
      {
        method: "POST",
        body: JSON.stringify({
          users: [username, opponent],
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.result;
  } catch (err) {
    console.error(err);
  }
};
