import { socketEmit } from "../app.js";

export const usernameToSocketIdMap = {};

export const openGames = {};

export async function startGame(req, res, next) {
  const { sender, to } = req.body;
  if (!sender || !to) return res.status(404).send("Missing body");
}

export async function userJoin(req, res, next) {
  try {
    console.log(req.body);
    const { username, opponent, socketId } = req.body;
    if (!username || !opponent || socketId === "")
      return res.status(404).send("Bad request");
    const gameId = getGameId(username, opponent);
    console.log(gameId);
    openGames[gameId] = { firstPlayer: "" };
    usernameToSocketIdMap[username] = socketId;
    console.log(usernameToSocketIdMap);
    if (!usernameToSocketIdMap[opponent]) return res.status(200);
    console.log("usernameToSocketIdMap");
    socketEmit("user-connection", "", usernameToSocketIdMap[opponent]);
    res.status(200).send();
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}

export async function getFirstPlayer(req, res, next) {
  try {
    const players = req.body.users;
    const gameId = getGameId(players[0], players[1]);
    console.log(gameId);
    if (openGames[gameId].firstPlayer !== "") {
      return res.status(200).json({ result: openGames[gameId].firstPlayer });
    }
    if (players.length !== 2) return res.status(404).send("No players");
    if (
      !existsInUsernameToSocketIdMap(players[0]) ||
      !existsInUsernameToSocketIdMap(players[1])
    ) {
      return res.status(404).send("One or more users is offline");
    }
    const chance = Math.floor(Math.random() * 100);
    const result = chance > 50 ? players[0] : players[1];
    console.log(result);
    setFirstPlayer(gameId, result);
    return res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
}

function parseUsersParam(usersParam) {
  if (!usersParam) throw new Error("No params provided");
  const [username, opponent] = usersParam.split(",");
  return { username, opponent };
}

export function existsInUsernameToSocketIdMap(username) {
  const arr = Object.keys(usernameToSocketIdMap);
  return arr.includes(username);
}

export function getGameId(username, opponent) {
  return `${username}&${opponent}`.split("").sort().join("");
}
export function setFirstPlayer(gameId, playername) {
  openGames[gameId].firstPlayer = playername;
}
