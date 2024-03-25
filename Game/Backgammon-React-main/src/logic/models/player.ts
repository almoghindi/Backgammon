export default class Player {
  _outBar: string[];
  _endBar: string[];
  _inTheEnd: boolean;

  constructor(
    readonly _name: string,
    readonly _icon: string,
    readonly _outBarIdx: string,
    readonly _endBarIdx: string,
    readonly _pieceColor: string,
    readonly _pieceBorderColor: string
  ) {
    this._outBar = [];
    this._endBar = [];
    this._inTheEnd = false;
  }

  public static new = () => new Player("", "", "", "", "", "");

  public get name(): string {
    return this._name;
  }

  public get icon(): string {
    return this._icon;
  }

  public get outBar(): string[] {
    return this._outBar;
  }
  public set outBar(value: string[]) {
    this._outBar = value;
  }

  public get outBarIdx(): string {
    return this._outBarIdx;
  }

  public get endBar(): string[] {
    return this._endBar;
  }
  public set endBar(value: string[]) {
    this._endBar = value;
  }

  public get endBarIdx(): string {
    return this._endBarIdx;
  }

  public get inTheEnd(): boolean {
    return this._inTheEnd;
  }
  public set inTheEnd(value: boolean) {
    this._inTheEnd = value;
  }

  public get pieceColor(): string {
    return this._pieceColor;
  }

  public get pieceBorderColor(): string {
    return this._pieceBorderColor;
  }

  public clone() {
    const newPlayer = new Player(
      this._name,
      this._icon,
      this._outBarIdx,
      this._endBarIdx,
      this._pieceColor,
      this._pieceBorderColor
    );

    newPlayer.outBar = [...this.outBar];
    newPlayer.endBar = [...this.endBar];
    newPlayer.inTheEnd = this._inTheEnd;

    return newPlayer;
  }
}
