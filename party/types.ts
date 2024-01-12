//#region Player
export interface Player {
  id: string;
  name: string;
  image: {
    backgroundColor: string;
    src: string;
  };
  connected?: boolean;
  isAlive?: boolean;
  isPartyLeader?: boolean;
  killWords?: string[];
  target?: Target | undefined;
  victims?: Target[];
}

export interface Target extends Pick<Player, "id" | "name" | "image"> {}
//#endregion

//#region Gate State
type WaitingState = "WaitingForPlayers";
type StartedState = "GameStarted";

export type GameState = WaitingState | StartedState;
//#endregion

//#region Client Messages
export interface AddPlayerMessage {
  type: "AddPlayer";
  player: Player;
}

export interface StartGameMessage {
  type: "StartGame";
}

export interface PlayerKillMessage {
  type: "PlayerKill";
  playerId: Player["id"];
}

export type ClientMessage = AddPlayerMessage | StartGameMessage;
//#endregion

//#region Server Messages
export interface PlayersUpdatedMessage {
  type: "PlayersUpdated";
  players: Player[];
}

export interface PlayerUpdatedMessage {
  type: "PlayerUpdated";
  player: Player;
}

export interface GameSateMessage {
  type: GameState;
}

export interface GameAlreadyStartedMessage {
  type: "GameAlreadyStarted";
}

export type ServerMessage =
  | PlayersUpdatedMessage
  | GameSateMessage
  | PlayerUpdatedMessage
  | GameAlreadyStartedMessage;
//#endregion
