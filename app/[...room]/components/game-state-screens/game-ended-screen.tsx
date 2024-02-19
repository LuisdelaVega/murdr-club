import type { Player } from "party/types";

interface GameEndedScreenProps {
  players: Player[];
}

export function GameEndedScreen({ players }: GameEndedScreenProps) {
  return (
    <div>
      Game has ended
      <pre className="break-words">
        {JSON.stringify(
          players.map(({ id, name, victims }) => ({
            id,
            name,
            victims: victims.map(({ id, name }) => ({ id, name })),
          })),
          null,
          2,
        )}
      </pre>
    </div>
  );
}
