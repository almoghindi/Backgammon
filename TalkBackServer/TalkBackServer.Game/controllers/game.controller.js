import {
  existsInUsernameToSocketIdMap,
  socketEmit,
  setFirstPlayer,
  getGameId,
  openGames,
} from "../app.js";

export async function startGame(req, res, next) {
  const { sender, to } = req.body;
  if (!sender || !to) return res.status(404).send("Missing body");
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
