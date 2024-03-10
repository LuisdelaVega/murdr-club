import type {
  AddPlayerMessage,
  Players,
  PlayersUpdatedMessage,
  TooLateMessage,
} from "common/types";
import Server from "party";
import * as Party from "partykit/server";
import { generateKillWords } from "../generate-kill-words";

export async function handleAddPlayer(
  server: Server,
  data: AddPlayerMessage,
  sender: Party.Connection<unknown>,
) {
  const {
    avatar: { id },
  } = data;

  // If the game has already started and a new player is trying to join, don't allow it
  if (server.gameState !== "WaitingForPlayers" && !server.players[id]) {
    sender.send(
      JSON.stringify({
        type: "TooLate",
        avatars: server.getAvatars(),
      } as TooLateMessage),
    );
    return;
  }

  if (!server.players[id]) {
    server.players[id] = {
      ...data.avatar,
      connected: true,
      killWords: generateKillWords(id),
      target: undefined,
      victims: [],
    };
  }

  server.players[id].connected = true;

  const players = server.getPlayersArray();

  if (!players.length || !players.find(({ isPartyLeader }) => isPartyLeader)) {
    server.players[id].isPartyLeader = true;
  }

  server.room.storage.put<Players>("players", server.players);

  server.room.broadcast(
    JSON.stringify({
      type: "PlayersUpdated",
      avatars: server.getAvatars(),
    } as PlayersUpdatedMessage),
  );

  server.setLastPlayedDate();
}
