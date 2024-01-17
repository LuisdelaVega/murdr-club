import { type Avatar as TAvatar } from "party/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PlayerAvatarProps {
  avatar: TAvatar;
  displayName?: boolean;
  displayLeaderTag?: boolean;
  isPartyLeader?: boolean;
  size?: "sm" | "lg";
}

export function PlayerAvatar({
  avatar,
  displayName = false,
  displayLeaderTag = false,
  isPartyLeader = false,
  size = "sm",
}: PlayerAvatarProps) {
  if (!avatar) {
    return null;
  }

  return (
    <div key={avatar.id} className="flex flex-col items-center gap-1 w-fit">
      <Avatar className={size === "sm" ? "h-20 w-20" : "h-44 w-44"}>
        <AvatarImage
          src={avatar.image}
          alt={`Image for player with username: ${avatar.name}`}
        />
        <AvatarFallback>{`${avatar.name[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>

      {displayName && (
        <span className={size === "lg" ? "text-4xl" : ""}>
          {avatar.name} {displayLeaderTag && isPartyLeader ? "(Leader)" : ""}
        </span>
      )}
    </div>
  );
}
