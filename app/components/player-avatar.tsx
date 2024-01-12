import { type Player } from "party/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PlayerAvatarProps {
  player: Player;
  displayName?: boolean;
  displayLeaderTag?: boolean;
}

export function PlayerAvatar({
  player,
  displayName = false,
  displayLeaderTag = false,
}: PlayerAvatarProps) {
  return (
    <div key={player.id} className="flex flex-col items-center gap-1">
      <Avatar
        className="h-20 w-20"
        style={{ backgroundColor: player.image.backgroundColor }}
      >
        <AvatarImage
          src={player.image.src}
          alt={`Image for player with username: ${player.name}`}
        />
        <AvatarFallback>{`${player.name[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>

      {displayName && (
        <span>
          {player.name} {displayLeaderTag && player.isPartyLeader && "(Leader)"}
        </span>
      )}
    </div>
  );
}
