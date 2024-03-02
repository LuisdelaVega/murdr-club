import { Button } from "@/components/ui/button";
import type { Avatar, StartGameMessage } from "common/types";
import { Swords } from "lucide-react";
import type PartySocket from "partysocket";
import { PlayerAvatar } from "../player-avatar";

interface Props {
  avatars: Avatar[];
  socket: PartySocket;
  isPartyLeader?: boolean;
}

export function LobbyScreen({ avatars, socket, isPartyLeader = false }: Props) {
  return (
    <div className="flex flex-col gap-10 items-center">
      {isPartyLeader && (
        <Button
          disabled={avatars.length <= 1}
          onClick={(e) => {
            e.preventDefault();
            socket.send(
              JSON.stringify({ type: "StartGame" } as StartGameMessage),
            );
          }}
        >
          <Swords className="w-4 h-4 mr-2" />
          {avatars.length <= 1 ? "Waiting for players" : "Start game"}
        </Button>
      )}

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
    </div>
  );
}
