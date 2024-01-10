import { Player } from "party/types";
import { PlayerAvatar } from "./player-avatar";

interface LobbyScreenProps {
  players: Player[];
}

export function LobbyScreen({ players }: LobbyScreenProps) {
  return players.map((player) => (
    <PlayerAvatar key={player.id} player={player} displayName />
  ));
}
