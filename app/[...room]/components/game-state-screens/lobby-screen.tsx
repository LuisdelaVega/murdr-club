import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";
import { type Avatar, type StartGameMessage } from "party/types";
import type PartySocket from "partysocket";
import { PlayerAvatar } from "../player-avatar";

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
          className="uppercase"
          onClick={(e) => {
            e.preventDefault();
            socket.send(
              JSON.stringify({ type: "StartGame" } as StartGameMessage),
            );
          }}
        >
          <Swords className="w-4 h-4 mr-2" />
          Start game
        </Button>
      )}
    </div>
  );
}
