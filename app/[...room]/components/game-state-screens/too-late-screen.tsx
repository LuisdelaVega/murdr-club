import { Button } from "@/components/ui/button";
import type { Avatar } from "common/types";
import { Home } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";
import { PlayerAvatar } from "../player-avatar";

interface Props {
  avatars: Avatar[];
}

export function TooLate({ avatars }: Props) {
  const toastTooLate = useRef<boolean>(true);

  if (toastTooLate.current) {
    toastTooLate.current = false;
    toast.warning("Too late! This game has already started");
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div>
        <h2 className="text-center">Too late!</h2>
        <span className="text-center">This game has already started</span>
      </div>
      <div className="flex flex-col items-center px-4 gap-2">
        <h4>Current players:</h4>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {avatars.map((avatar) => (
            <PlayerAvatar
              key={avatar.id}
              avatar={avatar}
              size="xs"
              displayName
            />
          ))}
        </div>
      </div>
      <Button asChild>
        <Link href="/">
          <Home className="w-4 h-4 mr-2" />
          Return to the homepage
        </Link>
      </Button>
    </div>
  );
}
