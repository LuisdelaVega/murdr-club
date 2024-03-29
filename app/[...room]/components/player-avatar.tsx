import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Avatar as IAvatar } from "common/types";
import { Crown } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  avatar: IAvatar;
  displayName?: boolean;
  displayLeaderTag?: boolean;
  isPartyLeader?: boolean;
  size?: "xs" | "sm" | "lg";
}

function getAvatarSize(size: Props["size"]) {
  switch (size) {
    case "xs":
      return "h-14 w-14";

    case "sm":
      return "h-20 w-20";

    default:
      return "h-44 w-44";
  }
}

export const PlayerAvatar = forwardRef<HTMLDivElement, Props>(
  function PlayerAvatar(
    {
      avatar,
      displayName = false,
      displayLeaderTag = false,
      isPartyLeader = false,
      size = "sm",
    },
    ref,
  ) {
    if (!avatar) {
      return null;
    }

    return (
      <div
        key={avatar.id}
        className="flex flex-col items-center gap-1 w-fit"
        ref={ref}
      >
        <Avatar className={getAvatarSize(size)}>
          <AvatarImage
            src={avatar.image}
            alt={`Image for player with username: ${avatar.name}`}
          />
          <AvatarFallback>{`${avatar.name[0]}`}</AvatarFallback>
        </Avatar>

        {displayName && (
          <div className="flex gap-2 items-center">
            <span className={size === "lg" ? "text-4xl" : ""}>
              {avatar.name}
            </span>
            {displayLeaderTag && isPartyLeader ? (
              <Crown
                className={cn(
                  "w-4 h-4 text-yellow-500",
                  size === "lg" && "w-8 h-8",
                )}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  },
);
