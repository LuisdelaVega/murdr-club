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
import { usePartySocket } from "@/hooks/use-party-socket";
import { useGSAP } from "@gsap/react";
import type { Player } from "common/types";
import gsap from "gsap";
import { Fingerprint, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfirmKillDialog } from "../confirm-kill-dialog";
import { DrawerBody } from "./drawer-body";

interface Props {
  player: Player;
}

export function SecretsDrawer({ player }: Props) {
  const socket = usePartySocket();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [timeline, setTimeline] = useState<gsap.core.Timeline>();

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        tl.pause();
      },
    });

    setTimeline(tl);
  });

  useEffect(() => {
    timeline?.play(0);
    setOpenDialog(false);
  }, [player.target?.id, timeline]);

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
          </DrawerHeader>
          {timeline && (
            <DrawerBody
              player={player}
              setOpenDialog={setOpenDialog}
              timeline={timeline}
            />
          )}
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
