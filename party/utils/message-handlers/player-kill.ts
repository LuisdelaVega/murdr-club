import type {
  GameSateMessage,
  GameState,
  PlayerKillMessage,
  PlayerUpdatedMessage,
  Players,
} from "common/types";
import Server from "party";
import * as Party from "partykit/server";

export async function handlePlayerKill(
  server: Server,
  data: PlayerKillMessage,
  sender: Party.Connection<unknown>,
) {
  // Get the players
  const player = server.players[sender.id];
  const killedPlayer = server.players[data.playerId];

  if (!killedPlayer || !player) {
    return;
  }

  // Kill the victim
  killedPlayer.killedBy = server.players[sender.id];

  /**
   * Update the killer (player)
   * They inherit the target and kill words form their victim
   */
  player.target = killedPlayer.target;
  player.killWords = killedPlayer.killWords;
  player.victims.push(server.getAvatarFromPlayer(killedPlayer));

  // Send the messages
  server.room.getConnection(killedPlayer.id)?.send(
    JSON.stringify({
      type: "PlayerUpdated",
      player: killedPlayer,
    } as PlayerUpdatedMessage),
  );

  server.room.getConnection(player.id)?.send(
    JSON.stringify({
      type: "PlayerUpdated",
      player,
    } as PlayerUpdatedMessage),
  );

  const players = server.getPlayersArray();
  const alivePlayersCount = players.filter(({ killedBy }) => !killedBy).length;

  console.log("alivePlayersCount", alivePlayersCount);

  if (alivePlayersCount === 1) {
    server.gameState = "GameEnded";
    server.room.broadcast(
      JSON.stringify({ type: "GameEnded", players } as GameSateMessage),
    );
  }

  server.room.storage.put<Players>("players", server.players);
  server.room.storage.put<GameState>("gameState", server.gameState);
  server.setLastPlayedDate();
}
