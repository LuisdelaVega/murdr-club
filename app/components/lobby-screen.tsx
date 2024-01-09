import { Player } from "party/types";
import { PlayerAvatar } from "./player-avatar";

interface LobbyScreenProps {
  players: Player[];
}

export function LobbyScreen({ players }: LobbyScreenProps) {
  return (
    <div className="flex flex-col gap-4">
      {players.map((player) => (
        <PlayerAvatar key={player.id} player={player} displayName />
      ))}
    </div>
  );
}
