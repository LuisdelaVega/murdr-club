import { Crown } from "lucide-react";
import { type Avatar as TAvatar } from "party/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PlayerAvatarProps {
  avatar: TAvatar;
  displayName?: boolean;
  displayLeaderTag?: boolean;
  isPartyLeader?: boolean;
  size?: "xs" | "sm" | "lg";
}

function getAvatarSize(size: PlayerAvatarProps["size"]) {
  switch (size) {
    case "xs":
      return "h-14 w-14";

    case "sm":
      return "h-20 w-20";

    default:
      return "h-44 w-44";
  }
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
      <Avatar className={getAvatarSize(size)}>
        <AvatarImage
          src={avatar.image}
          alt={`Image for player with username: ${avatar.name}`}
        />
        <AvatarFallback>{`${avatar.name[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>

      {displayName && (
        <div className="flex gap-2 items-center">
          <span className={size === "lg" ? "text-4xl" : ""}>{avatar.name}</span>
          {displayLeaderTag && isPartyLeader ? (
            <Crown className="w-4 h-4 text-yellow-500" />
          ) : null}
        </div>
      )}
    </div>
  );
}
