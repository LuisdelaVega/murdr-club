import Server from "party";
import type {
  GameSateMessage,
  GameState,
  Player,
  PlayerUpdatedMessage,
  Players,
} from "party/types";
import { shuffleArray } from "../shuffle-array";

export function handleStartGame(server: Server) {
  const shuffledPlayers = shuffleArray<Player>(server.getPlayersArray());

  for (let index = 0; index < shuffledPlayers.length; index++) {
    const player = shuffledPlayers[index];
    const targetPlayer =
      shuffledPlayers[index === shuffledPlayers.length - 1 ? 0 : index + 1];

    player.target = {
      id: targetPlayer.id,
      image: targetPlayer.image,
      name: targetPlayer.name,
      connected: targetPlayer.connected,
    };

    // Send a message to each individual player to let them know their player was updated
    server.room.getConnection(player.id)?.send(
      JSON.stringify({
        type: "PlayerUpdated",
        player,
      } as PlayerUpdatedMessage),
    );
  }

  // Set and send the gameState
  server.gameState = "GameStarted";
  server.room.broadcast(
    JSON.stringify({ type: server.gameState } as GameSateMessage),
  );

  server.room.storage.put<GameState>("gameState", server.gameState);
  server.room.storage.put<Players>("players", server.players);
  server.setLastPlayedDate();
}
