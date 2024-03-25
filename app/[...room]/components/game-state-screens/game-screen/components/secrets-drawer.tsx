import { PlayerAvatar } from "@/[...room]/components/player-avatar";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Player } from "common/types";
import { Fingerprint, ShieldAlert, Skull } from "lucide-react";
import type PartySocket from "partysocket";
import { useEffect, useState } from "react";
import { ConfirmKillDialog } from "./confirm-kill-dialog";

interface Props {
  player: Player;
  socket: PartySocket;
}

export function SecretsDrawer({ player, socket }: Props) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    setOpenDialog(false);
  }, [player]);

  return (
    <>
      <Drawer>
        <Button asChild>
          <DrawerTrigger>
            <Fingerprint className="w-4 h-4 mr-2" />
            Mission info
          </DrawerTrigger>
        </Button>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center flex  justify-center items-center gap-2">
              <Fingerprint className="w-8 h-8" />
              Top Secret
              <ShieldAlert className="w-8 h-8" />
            </DrawerTitle>
            <div className="grid grid-cols-2 grid-rows-1">
              <div className="flex flex-col gap-2 items-center">
                <h3>Target</h3>
                <PlayerAvatar avatar={player.target!} displayName />
                <div className="flex gap-2">
                  <Button
                    className="w-fit"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenDialog(true);
                    }}
                  >
                    <Skull className="w-4 h-4 mr-2" />
                    Confirm Kill
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-center">
                <h3>Kill Words</h3>
                <div className="flex flex-col gap-1 items-center">
                  {player.killWords.map((word) => (
                    <span
                      key={`${player.victims.length}-${word}`}
                      className="text-lg mt-1"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <Button asChild>
              <DrawerClose>Close</DrawerClose>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ConfirmKillDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        player={player}
        socket={socket}
      />
    </>
  );
}
