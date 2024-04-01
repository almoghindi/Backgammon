import Player from "./player";

export default class ThisTurn {
  _rolledDice: boolean = false;
  _maxMoves: number = 0;
  _movesMade: number = 0;

  constructor(
    public readonly _turnPlayer: Player,
    public readonly _opponentPlayer: Player,
    public _dices: number[],
    public _beginning: boolean
  ) {
    if (_beginning && _dices.length === 2) {
      if (this._maxMoves === 0 && this.dices[0] === this.dices[1]) {
        this.dices.push(this.dices[0]);
        this.dices.push(this.dices[0]);
      }
      this._beginning = false;
      this._rolledDice = true;
      this._maxMoves = this._dices.reduce((a, b) => a + b, 0);
      this._movesMade = 0;
    } else {
      this._rolledDice = false;
      this._maxMoves = 0;
      this._movesMade = 0;
    }
  }

  public static new = () => new ThisTurn(Player.new(), Player.new(), [], false);

  public get turnPlayer(): Player {
    return this._turnPlayer;
  }

  public get opponentPlayer(): Player {
    return this._opponentPlayer;
  }

  public get rolledDice(): boolean {
    return this._rolledDice;
  }
  public set rolledDice(value: boolean) {
    this._rolledDice = value;
  }

  public get dices(): number[] {
    return this._dices;
  }
  public set dices(value: number[]) {
    this._dices = value;
  }

  public get movesMade(): number {
    return this._movesMade;
  }
  public set movesMade(value: number) {
    this._movesMade = value;
  }

  public get maxMoves(): number {
    return this._maxMoves;
  }
  public set maxMoves(value: number) {
    this._maxMoves = value;
  }

  public toJSON() {
    return JSON.stringify({
      _rolledDice: this._rolledDice,
      _maxMoves: this._maxMoves,
      _movesMade: this._movesMade,
      _turnPlayer: this._turnPlayer.toJSON(),
      _opponentPlayer: this._opponentPlayer.toJSON(),
      _dices: this._dices,
      _beginning: this._beginning,
    });
  }

  // Ensure the object can be reconstructed from a plain object
  public static fromJSON(json: string) {
    console.log("turn json", json);
    try {
      let parsed = JSON.parse(json);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      const { _turnPlayer, _opponentPlayer, _dices, _beginning, ...rest } =
        parsed;
      const turn = new ThisTurn(
        Player.fromJSON(_turnPlayer),
        Player.fromJSON(_opponentPlayer),
        _dices,
        _beginning
      );
      return {
        _turnPlayer: turn._turnPlayer,
        _opponentPlayer: turn._opponentPlayer,
        _dices: turn._dices,
        _beginning: turn._beginning,
        ...rest,
      };
    } catch (err) {
      console.error(err);
      return new ThisTurn(Player.new(), Player.new(), [], false);
    }
  }
  public clone() {
    const newThisTurn = new ThisTurn(
      this._turnPlayer,
      this._opponentPlayer,
      this._dices,
      false
    );

    newThisTurn.rolledDice = this._rolledDice;
    newThisTurn.maxMoves = this._maxMoves;
    newThisTurn.movesMade = this._movesMade;

    return newThisTurn;
  }
}
