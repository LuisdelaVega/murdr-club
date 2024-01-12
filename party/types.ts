export interface Player {
  image: {
    backgroundColor: string;
    src: string;
  };
  id: string;
  name: string;
  isPartyLeader?: boolean;
  connected?: boolean;
}

//#region Gate State
type WaitingState = "WaitingForPlayers";
type StartedState = "GameStarted";

export type GameState = WaitingState | StartedState;
//#endregion

//#region HTTP Responses
export interface GetGameStateResponse {
  gameState: GameState;
}
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

export interface GameSateMessage {
  type: GameState;
}

export type ServerMessage = PlayersUpdatedMessage | GameSateMessage;
//#endregion
