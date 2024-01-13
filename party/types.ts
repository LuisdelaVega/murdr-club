//#region Player
export interface Avatar {
  id: string;
  name: string;
  image: {
    backgroundColor: string;
    src: string;
  };
  isPartyLeader?: boolean;
}
export interface Player extends Avatar {
  connected: boolean;
  isAlive: boolean;
  killWords: string[];
  target: Avatar | undefined;
  victims: Avatar[];
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
