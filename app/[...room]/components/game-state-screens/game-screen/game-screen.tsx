import { ZOD_STRING, shortUniqueIdOptions } from "@/utils/constants";
import type { Player } from "common/types";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { PlayerAvatar } from "../../player-avatar";
import { SecretsDrawer } from "./components/secrets-drawer";

const formSchema = z.object({
  targetId: ZOD_STRING.schema.length(shortUniqueIdOptions.length ?? 8),
});

interface Props {
  player: Player;
}

export function GameScreen({ player }: Props) {
  const [displayId, setDisplayId] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col gap-1 items-center">
        {/* "You are dead!" Message */}
        {player.killedBy && <h2>You are dead!</h2>}

        {/* Player Avatar */}
        <PlayerAvatar avatar={player} displayName size="lg" />

        {/* Player ID */}
        <span
          onClick={(e) => {
            e.preventDefault();
            setDisplayId(!displayId);
          }}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300"
        >
          ID: {displayId ? player.id : player.id.replaceAll(/./g, "*")}
          {displayId ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </span>
      </div>

      {/* Killed By */}
      {player.killedBy && (
        <div className="flex flex-col items-center">
          <h4>Killed by:</h4>
          <PlayerAvatar avatar={player.killedBy} size="xs" displayName />
        </div>
      )}

      {/* Secrets Drawer */}
      {!player.killedBy && <SecretsDrawer player={player} />}

      {/* Victims Section */}
      {player.victims.length > 0 && (
        <div className="flex flex-col items-center px-4 gap-2">
          <h4>Victims:</h4>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {player.victims.map((victim) => (
              <PlayerAvatar
                key={victim.id}
                avatar={victim}
                size="xs"
                displayName
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
