export interface Player {
  image: {
    backgroundColor: string;
    src: string;
  };
  id: string;
  name: string;
  isPartyLeader?: boolean;
}

//#region Client Messages
export interface AddPlayerMessage {
  type: "AddPlayer";
  player: Player;
}

export type ClientMessage = AddPlayerMessage;
//#endregion

//#region Server Messages
export interface PlayersUpdatedMessage {
  type: "PlayersUpdated";
  players: Player[];
}

export type ServerMessage = PlayersUpdatedMessage;
//#endregion
