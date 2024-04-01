import Player from "./player";

export default class Game {
  _gameOn: boolean;
  _board: string[][];
  _whitePlayer: Player;
  _blackPlayer: Player;

  constructor() {
    this._gameOn = false;
    this._board = Game.initialState();
    this._whitePlayer = new Player(
      "White",
      "⚪ WHITE ⚪",
      "WhiteOutBar",
      "WhiteEndBar",
      "White",
      "1px solid black"
    );
    this._blackPlayer = new Player(
      "Black",
      "⚫ BLACK ⚫",
      "BlackOutBar",
      "BlackEndBar",
      "Black",
      "1px solid #e9e2d6"
    );
  }

  public static new = () => new Game();

  public static initialState = () => [
    ["White", "White", "White", "White", "White"],
    [],
    [],
    [],
    ["Black", "Black", "Black"],
    [],
    ["Black", "Black", "Black", "Black", "Black"],
    [],
    [],
    [],
    [],
    ["White", "White"],
    ["Black", "Black", "Black", "Black", "Black"],
    [],
    [],
    [],
    ["White", "White", "White"],
    [],
    ["White", "White", "White", "White", "White"],
    [],
    [],
    [],
    [],
    ["Black", "Black"],
  ];

  public get gameOn(): boolean {
    return this._gameOn;
  }
  public set gameOn(value: boolean) {
    this._gameOn = value;
  }

  public get board(): string[][] {
    return this._board;
  }
  public set board(value: string[][]) {
    this._board = value;
  }

  public get whitePlayer(): Player {
    return this._whitePlayer;
  }
  public set whitePlayer(value: Player) {
    this._whitePlayer = value;
  }

  public get blackPlayer(): Player {
    return this._blackPlayer;
  }
  public set blackPlayer(value: Player) {
    this._blackPlayer = value;
  }

  public toJSON() {
    return JSON.stringify({
      _gameOn: this._gameOn,
      _board: this._board,
      _whitePlayer: this._whitePlayer.toJSON(), // Serialize whitePlayer object
      _blackPlayer: this._blackPlayer.toJSON(), // Serialize blackPlayer object
    });
  }

  // Deserialize plain object to Game object
  public static fromJSON(json: string) {
    try {
      console.log("game json", json);

      const { _gameOn, _board, _whitePlayer, _blackPlayer } = JSON.parse(json);

      if (
        typeof _gameOn !== "boolean" ||
        !Array.isArray(_board) ||
        typeof _whitePlayer !== "string" ||
        typeof _blackPlayer !== "string"
      ) {
        throw new Error("Invalid JSON format");
      }

      if (!_whitePlayer || !_blackPlayer) {
        throw new Error("Invalid player data");
      }

      const game = new Game();
      game._gameOn = _gameOn;
      game._board = _board;
      game._whitePlayer = Player.fromJSON(_whitePlayer);
      game._blackPlayer = Player.fromJSON(_blackPlayer);
      return game;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  public clone() {
    const newGame = new Game();
    newGame.gameOn = this._gameOn;
    newGame._board = [...this._board];
    newGame.whitePlayer = this._whitePlayer.clone();
    newGame.blackPlayer = this.blackPlayer.clone();
    return newGame;
  }
}
