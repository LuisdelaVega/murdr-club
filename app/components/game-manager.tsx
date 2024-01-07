"use client";

import { PARTYKIT_HOST } from "@/env";
import { AddPlayerMessage, Player, ServerMessage } from "party/types";
import usePartySocket from "partysocket/react";
import { useMemo, useState } from "react";
import { LobbyScreen } from "./lobby-screen";

interface GameManagerProps {
  room: string;
  player: Player;
}

export function GameManager({ room, player }: GameManagerProps) {
  const [players, setPlayers] = useState<Player[]>([player]);

  const myPlayer = useMemo(() => {
    return players.find((val) => val.id === player.id);
  }, [player.id, players]);

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

        default:
          break;
      }
    },
  });

  return (
    <>
      <LobbyScreen players={players} room={room} />
      {myPlayer?.isPartyLeader && "You're the party leader"}
    </>
  );
}
