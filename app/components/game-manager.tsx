"use client";

import { PARTYKIT_HOST } from "@/env";
import {
  type AddPlayerMessage,
  type GameState,
  type Player,
  type ServerMessage,
} from "party/types";
import usePartySocket from "partysocket/react";
import { useState } from "react";
import { LobbyScreen } from "./lobby-screen";

interface GameManagerProps {
  room: string;
  player: Player;
}

export function GameManager({ room, player }: GameManagerProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [myPlayer, setMyPlayer] = useState<Player>(player);

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
    onMessage(message) {
      const data = JSON.parse(message.data) as ServerMessage;

      switch (data.type) {
        case "PlayersUpdated":
          setPlayers(data.players);

          // Update my player
          const myUpdatedPlayer = data.players.find(
            ({ id }) => id === player.id,
          );

          if (myUpdatedPlayer) {
            setMyPlayer(myUpdatedPlayer);
          }
          break;

        case "PlayerUpdated":
          console.log(data.player);
          setMyPlayer(data.player);
          break;

        case "WaitingForPlayers":
        case "GameStarted":
          setGameState(data.type);
          break;

        default:
          break;
      }
    },
  });

  switch (gameState) {
    case "WaitingForPlayers":
      return (
        <LobbyScreen
          players={players}
          socket={socket}
          isPartyLeader={myPlayer.isPartyLeader}
        />
      );

    default:
      return "Game Started screen";
  }
}
