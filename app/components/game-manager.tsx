"use client";

import { PARTYKIT_HOST } from "@/env";
import {
  type AddPlayerMessage,
  type Avatar,
  type GameState,
  type Player,
  type ServerMessage,
} from "party/types";
import usePartySocket from "partysocket/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { GameScreen } from "./game-state-screens/game-screen";
import { LobbyScreen } from "./game-state-screens/lobby-screen";

interface GameManagerProps {
  room: string;
  avatar: Avatar;
}

export function GameManager({ room, avatar }: GameManagerProps) {
  const [myPlayer, setMyPlayer] = useState<Player>();
  const [avatars, setAvatars] = useState<Avatar[]>([avatar]);
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [tooLate, setTooLate] = useState<boolean>(false);

  const myAvatar = useMemo(
    () => avatars.find(({ id }) => avatar.id === id),
    [avatar.id, avatars],
  );

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room,
    id: avatar.id,
    onOpen() {
      // After connecting to the websocket server, register add yourself as a player
      socket.send(
        JSON.stringify({
          type: "AddPlayer",
          avatar,
        } as AddPlayerMessage),
      );
    },
    onMessage(message) {
      const data = JSON.parse(message.data) as ServerMessage;

      switch (data.type) {
        case "PlayersUpdated":
          setAvatars(data.avatars);
          break;

        case "PlayerUpdated":
          setMyPlayer(data.player);
          break;

        case "WaitingForPlayers":
        case "GameStarted":
          setGameState(data.type);
          break;

        case "TooLate":
          toast.warning("You're too late! This game has already started 😓");
          setTooLate(true);
          break;

        default:
          break;
      }
    },
  });

  if (tooLate) {
    return "Game already started 😓";
  }

  switch (gameState) {
    case "GameStarted":
      if (myPlayer) {
        return <GameScreen player={myPlayer} socket={socket} />;
      }

    case "WaitingForPlayers":
      if (myAvatar) {
        return (
          <LobbyScreen
            avatars={avatars}
            socket={socket}
            isPartyLeader={myAvatar.isPartyLeader}
          />
        );
      }

    default:
      return "Waiting for server...";
  }
}
