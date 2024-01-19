import Server from "party";
import type {
  AddPlayerMessage,
  Players,
  PlayersUpdatedMessage,
  TooLateMessage,
} from "party/types";
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
  if (server.gameState === "GameStarted" && !server.players[id]) {
    sender.send(
      JSON.stringify({
        type: "TooLate",
      } as TooLateMessage),
    );
    return;
  }

  if (!server.players[id]) {
    server.players[id] = {
      ...data.avatar,
      connected: true,
      isAlive: true,
      killWords: generateKillWords(id),
      target: undefined,
      victims: [],
    };
  }

  server.players[id].connected = true;

  const players = Object.values(server.players);

  if (!players.length || !players.find(({ isPartyLeader }) => isPartyLeader)) {
    server.players[id].isPartyLeader = true;
  }

  server.room.storage.put<Players>("players", server.players);

  server.broadcastToRoom<PlayersUpdatedMessage>({
    type: "PlayersUpdated",
    avatars: server.getAvatars(),
  });
}
