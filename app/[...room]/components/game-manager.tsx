"use client";

import { PARTYKIT_HOST } from "@/env";
import type {
  AddPlayerMessage,
  Avatar,
  GameState,
  Player,
  ServerMessage,
} from "common/types";
import { PartyPopper } from "lucide-react";
import usePartySocket from "partysocket/react";
import { useMemo, useReducer, useRef } from "react";
import { toast } from "sonner";
import { GameEndedScreen } from "./game-state-screens/game-ended-screen";
import { GameScreen } from "./game-state-screens/game-screen";
import { LobbyScreen } from "./game-state-screens/lobby-screen";
import { TooLate } from "./game-state-screens/too-late-screen";

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
      return { ...state, tooLate: true, avatars: action.avatars };

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

interface Props {
  room: string;
  avatar: Avatar;
}

export function GameManager({ room, avatar }: Props) {
  const displayWelcomeMessageRef = useRef<boolean>(true);
  const [{ avatars, myPlayer, allPlayers, gameState, tooLate }, dispatch] =
    useReducer(reducer, {
      avatars: [avatar],
      tooLate: false,
      allPlayers: undefined,
      gameState: undefined,
      myPlayer: undefined,
    });

  /**
   * We need to check every time the avatars change in case
   * our own avatar changes. Specifically the value of the
   * `isPartyLeader` parameter.
   */
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
    return <TooLate avatars={avatars} />;
  }

  if (displayWelcomeMessageRef.current) {
    displayWelcomeMessageRef.current = false;
    toast.success(
      <>
        <PartyPopper className="w-4 h-4 mr-2" />
        <span>Welcome to the room</span>
      </>,
    );
  }

  // Return the appropriate screen
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
        return <GameEndedScreen players={allPlayers} />;
      }

    default:
      // TODO Create WaitingForServer component
      return "Waiting for server...";
  }
}
