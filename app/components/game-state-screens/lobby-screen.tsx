import { type Avatar, type StartGameMessage } from "party/types";
import type PartySocket from "partysocket";
import { PlayerAvatar } from "../player-avatar";
import { Button } from "../ui/button";

interface LobbyScreenProps {
  avatars: Avatar[];
  socket: PartySocket;
  isPartyLeader?: boolean;
}

export function LobbyScreen({
  avatars,
  socket,
  isPartyLeader = false,
}: LobbyScreenProps) {
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-4 items-center">
        {avatars.map((avatar) => (
          <PlayerAvatar
            key={avatar.id}
            avatar={avatar}
            displayName
            displayLeaderTag
            isPartyLeader={avatar.isPartyLeader}
          />
        ))}
      </div>

      {avatars.length > 1 && isPartyLeader && (
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
