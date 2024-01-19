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
  isAlive: boolean;
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
type WaitingState = "WaitingForPlayers";
type StartedState = "GameStarted";

export type GameState = WaitingState | StartedState;
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

export type ClientMessage = AddPlayerMessage | StartGameMessage;
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
}

export interface TooLateMessage {
  type: "TooLate";
}

export type ServerMessage =
  | PlayersUpdatedMessage
  | GameSateMessage
  | PlayerUpdatedMessage
  | TooLateMessage;
//#endregion
