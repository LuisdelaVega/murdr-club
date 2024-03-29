import { PlayerAvatar } from "@/[...room]/components/player-avatar";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Skull } from "lucide-react";
import { useRef } from "react";
import { SecretsDrawer } from ".";

interface Props extends Pick<Parameters<typeof SecretsDrawer>[0], "player"> {
  setOpenDialog: (value: boolean) => void;
}

export function DrawerBody({ player, setOpenDialog }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const playerAvatar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(playerAvatar.current, { opacity: 0 });
      gsap.to(playerAvatar.current, { opacity: 1, duration: 3 });
    },
    { scope: container },
  );

  return (
    <div className="grid grid-cols-2 grid-rows-1" ref={container}>
      <div className="flex flex-col gap-2 items-center">
        <h3>Target</h3>
        <PlayerAvatar avatar={player.target!} displayName ref={playerAvatar} />
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
  );
}
