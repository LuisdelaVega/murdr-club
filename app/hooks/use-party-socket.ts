import { SocketContext } from "@/[...room]/components/game-manager";
import { useContext } from "react";

export function usePartySocket() {
  const socketContext = useContext(SocketContext);

  if (!socketContext.socket) {
    throw new Error("PartySocket missing");
  }

  return socketContext.socket;
}
