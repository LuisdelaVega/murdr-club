import { Eye, EyeOff } from "lucide-react";
import { type Player } from "party/types";
import type PartySocket from "partysocket";
import { useState } from "react";
import { PlayerAvatar } from "../player-avatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

interface GameScreenProps {
  player: Player;
  socket: PartySocket;
}

export function GameScreen({ player }: GameScreenProps) {
  const [displayId, setDisplayId] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-1 items-center">
        <PlayerAvatar avatar={player} displayName size="lg" />
        <span
          onClick={(e) => {
            e.preventDefault();
            setDisplayId(!displayId);
          }}
          className="flex items-center gap-2 text-gray-500 text-xs"
        >
          ID: {displayId ? player.id : player.id.replaceAll(/./g, "*")}
          {displayId ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </span>
      </div>

      {/* Secrets Drawer */}
      <Drawer>
        <Button asChild>
          <DrawerTrigger>View Target and Kill Words</DrawerTrigger>
        </Button>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">
              ⚠️ For your eyes only 👀
            </DrawerTitle>
            <DrawerDescription className="grid grid-cols-2 grid-rows-1">
              <div className="flex flex-col gap-2 items-center">
                <h2>Target</h2>
                <PlayerAvatar avatar={player.target!} displayName />
                <Button className="mt-4 w-fit">Kill</Button>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <h2>Kill Words</h2>
                <div className="flex flex-col gap-1 items-center">
                  <span>forest</span>
                  <span>story</span>
                  <span>exercise</span>
                </div>
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button asChild>
              <DrawerClose>Close</DrawerClose>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
