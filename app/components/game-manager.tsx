"use client";

import { PARTYKIT_HOST } from "@/env";
import {
  AddPlayerMessage,
  GameState,
  Player,
  ServerMessage,
  StartGameMessage,
} from "party/types";
import usePartySocket from "partysocket/react";
import { useMemo, useState } from "react";
import { LobbyScreen } from "./lobby-screen";
import { Button } from "./ui/button";

interface GameManagerProps {
  room: string;
  player: Player;
}

export function GameManager({ room, player }: GameManagerProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState | undefined>();
  // const [victims, setVictims] = useLocalStorage<Player[]>("victims", []);

  const myPlayer = useMemo(
    () => players.find(({ id }) => id === player.id),
    [player.id, players],
  );

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room,
    id: player.id,
    onOpen() {
      // After connecting to the websocket server, register add yourself as a player
      socket.send(
        JSON.stringify({
          type: "AddPlayer",
          player: player,
        } as AddPlayerMessage),
      );
    },
    onMessage(event) {
      const message = JSON.parse(event.data) as ServerMessage;

      switch (message.type) {
        case "PlayersUpdated":
          setPlayers(message.players);
          break;

        case "WaitingForPlayers":
        case "GameStarted":
          setGameState(message.type);

        default:
          break;
      }
    },
  });

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-4">
        <LobbyScreen players={players} />
      </div>
      {myPlayer?.isPartyLeader && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            socket.send(
              JSON.stringify({ type: "StartGame" } as StartGameMessage),
            );
          }}
        >
          Game State: {gameState}
        </Button>
      )}
    </div>
  );
}
