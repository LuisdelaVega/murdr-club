import { Player } from "party/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PlayerAvatarProps {
  player: Player;
  displayName?: boolean;
}

export function PlayerAvatar({
  player,
  displayName = false,
}: PlayerAvatarProps) {
  return (
    <div key={player.id} className="flex flex-col items-center gap-1">
      <Avatar
        className="h-20 w-20"
        style={{ backgroundColor: player.image.backgroundColor }}
      >
        <AvatarImage
          src={player.image.src}
          alt={`lorelei image with for player with username: ${player.name}`}
        />
        <AvatarFallback>{`${player.name[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>

      {displayName && <span>{player.name}</span>}
    </div>
  );
}
