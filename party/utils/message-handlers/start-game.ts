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
  server.gameState = "GameStarted";
  server.room.storage.put<GameState>("gameState", server.gameState);
  server.broadcastToRoom<GameSateMessage>({ type: server.gameState });

  const shuffledPlayers = shuffleArray<Player>(Object.values(server.players));

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

    server.room.getConnection(player.id)?.send(
      JSON.stringify({
        type: "PlayerUpdated",
        player,
      } as PlayerUpdatedMessage),
    );
  }

  server.room.storage.put<Players>("players", server.players);
}
