import type { Player } from "party/types";
import { PlayerAvatar } from "../player-avatar";

interface Props {
  players: Player[];
}

export function GameEndedScreen({ players }: Props) {
  const playersCopy = [...players];
  const indexOfWinner = playersCopy.findIndex((player) => !player.killedBy);
  // Get the winner (inside of an array)
  const winnerArr = playersCopy.splice(indexOfWinner, 1);
  // Sort the players based on how many victims they collected
  playersCopy.sort((a, b) => b.victims.length - a.victims.length);
  // Place the winner in front of the sorted players
  const sortedPlayers = winnerArr.concat(playersCopy);

  return (
    <div className="flex flex-col items-center gap-8 pb-10 px-8">
      <h1 className="border-b-2 border-slate-200">Game over</h1>
      {sortedPlayers.map((player, i) => (
        <div
          key={player.id}
          className="flex flex-col items-center gap-2 min-w-full"
        >
          {i === 0 && <h2>Winner</h2>}
          <PlayerAvatar
            avatar={player}
            displayName
            size="lg"
            displayLeaderTag
            isPartyLeader={!i}
          />
          {player.victims.length > 0 && (
            <div className="flex flex-col items-center gap-2 px-4">
              <h4>Victims:</h4>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {player.victims.map((victim) => (
                  <PlayerAvatar
                    key={victim.id}
                    avatar={victim}
                    displayName
                    size="xs"
                  />
                ))}
              </div>
            </div>
          )}
          {i !== sortedPlayers.length - 1 && <hr className="min-w-full mt-6" />}
        </div>
      ))}
    </div>
  );
}
