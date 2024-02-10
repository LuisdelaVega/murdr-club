"use client";

import { PARTYKIT_HOST } from "@/env";
import { PartyPopper } from "lucide-react";
import {
  type AddPlayerMessage,
  type Avatar,
  type GameState,
  type Player,
  type ServerMessage,
} from "party/types";
import usePartySocket from "partysocket/react";
import { useMemo, useReducer, useRef } from "react";
import { toast } from "sonner";
import { GameScreen } from "./game-state-screens/game-screen";
import { LobbyScreen } from "./game-state-screens/lobby-screen";

interface ReducerState {
  myPlayer: Player | undefined;
  avatars: Avatar[];
  allPlayers: Player[] | undefined;
  gameState: GameState | undefined;
  tooLate: boolean;
}

function reducer(state: ReducerState, action: ServerMessage): ReducerState {
  switch (action.type) {
    case "PlayersUpdated":
      return { ...state, avatars: action.avatars };

    case "PlayerUpdated":
      return { ...state, myPlayer: action.player };

    case "WaitingForPlayers":
    case "GameStarted":
      return { ...state, gameState: action.type };

    case "TooLate":
      return { ...state, tooLate: true };

    case "GameEnded":
      return {
        ...state,
        allPlayers: action.players,
        gameState: action.type,
      };

    default:
      return state;
  }
}

interface GameManagerProps {
  room: string;
  avatar: Avatar;
}

export function GameManager({ room, avatar }: GameManagerProps) {
  const displayWelcomeMessageRef = useRef<boolean>(true);
  const [{ avatars, myPlayer, allPlayers, gameState, tooLate }, dispatch] =
    useReducer(reducer, {
      avatars: [avatar],
      tooLate: false,
      allPlayers: undefined,
      gameState: undefined,
      myPlayer: undefined,
    });

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
      dispatch(JSON.parse(message.data) as ServerMessage);
    },
  });

  if (tooLate) {
    // TODO Redirect the user to a TooLate page
    toast.warning("You're too late! This game has already started 😓");
    return "Game already started 😓";
  }

  if (displayWelcomeMessageRef.current) {
    toast.success(
      <>
        <PartyPopper className="w-4 h-4 mr-2" />
        <span className="uppercase">Welcome to the room</span>
      </>,
    );
    displayWelcomeMessageRef.current = false;
  }

  switch (gameState) {
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

    case "GameStarted":
      if (myPlayer) {
        return <GameScreen player={myPlayer} socket={socket} />;
      }

    case "GameEnded":
      if (allPlayers) {
        // TODO Create the GameEnded screen
        return (
          <div>
            Game has ended
            <pre className="break-words">
              {JSON.stringify(
                allPlayers.map(({ id, name, victims }) => ({
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

    default:
      // TODO Create WaitingForServer component
      return "Waiting for server...";
  }
}
