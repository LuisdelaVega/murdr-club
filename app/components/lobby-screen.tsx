import { type Player, type StartGameMessage } from "party/types";
import type PartySocket from "partysocket";
import { PlayerAvatar } from "./player-avatar";
import { Button } from "./ui/button";

interface LobbyScreenProps {
  players: Player[];
  socket: PartySocket;
  isPartyLeader?: boolean;
}

export function LobbyScreen({
  players,
  socket,
  isPartyLeader = false,
}: LobbyScreenProps) {
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-4">
        {players.map((player) => (
          <PlayerAvatar
            key={player.id}
            player={player}
            displayName
            displayLeaderTag
          />
        ))}
      </div>

      {isPartyLeader && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            socket.send(
              JSON.stringify({ type: "StartGame" } as StartGameMessage),
            );
          }}
        >
          Start game
        </Button>
      )}
    </div>
  );
}
