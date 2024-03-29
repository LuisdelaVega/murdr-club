//#region Player
export interface Avatar {
  id: string;
  name: string;
  image: string;
  isPartyLeader?: boolean;
}

interface Target extends Avatar {
  connected: boolean;
}

export interface Player extends Avatar {
  connected: boolean;
  killWords: string[];
  target: Target | undefined;
  victims: Avatar[];
  killedBy?: Avatar;
}

export interface Players {
  [key: string]: Player;
}
//#endregion

//#region Gate State
export type GameState = "WaitingForPlayers" | "GameStarted" | "GameEnded";
//#endregion

//#region Client Messages
export interface AddPlayerMessage {
  type: "AddPlayer";
  avatar: Avatar;
}

export interface StartGameMessage {
  type: "StartGame";
}

export interface PlayerKillMessage {
  type: "PlayerKill";
  playerId: Player["id"];
}

export type ClientMessage =
  | AddPlayerMessage
  | StartGameMessage
  | PlayerKillMessage;
//#endregion

//#region Server Messages
export interface PlayersUpdatedMessage {
  type: "PlayersUpdated";
  avatars: Avatar[];
}

export interface PlayerUpdatedMessage {
  type: "PlayerUpdated";
  player: Player;
}

export interface GameSateMessage {
  type: GameState;
  players?: Player[];
}

export interface TooLateMessage {
  type: "TooLate";
  avatars: Avatar[];
}

export type ServerMessage =
  | PlayersUpdatedMessage
  | GameSateMessage
  | PlayerUpdatedMessage
  | TooLateMessage;
//#endregion
