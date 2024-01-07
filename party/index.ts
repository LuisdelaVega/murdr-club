import * as Party from "partykit/server";
import { ClientMessage, Player, PlayersUpdatedMessage } from "./types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  players: Player[] = [];

  broadcastToRoom<T>(value: T) {
    this.room.broadcast(JSON.stringify(value));
  }

  onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext,
  ): void | Promise<void> {
    // A websocket just connected!
    console.log(
      `Connected with id: ${connection.id} room: ${this.room.id} url: ${
        new URL(ctx.request.url).pathname
      }`,
    );
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log(`Disconnected: id: ${connection.id} room: ${this.room.id}`);
    // Remove the disconnected player from the players array
    let removedLeader = false;

    this.players = this.players.filter((player) => {
      let passedTheCheck = player.id !== connection.id;

      if (!passedTheCheck) {
        removedLeader = !!player.isPartyLeader;
      }

      return passedTheCheck;
    });

    if (removedLeader && this.players.length) {
      this.players[0].isPartyLeader = true;
    }

    this.broadcastToRoom<PlayersUpdatedMessage>({
      type: "PlayersUpdated",
      players: this.players,
    });
  }

  onMessage(
    message: string,
    sender: Party.Connection<unknown>,
  ): void | Promise<void> {
    console.log(`Message from connection with id: ${sender.id}`);
    const data = JSON.parse(message) as ClientMessage;

    switch (data.type) {
      case "AddPlayer":
        const { player } = data;
        if (!this.players.length) {
          player.isPartyLeader = true;
        }

        this.players.push(player);

        this.broadcastToRoom<PlayersUpdatedMessage>({
          type: "PlayersUpdated",
          players: this.players,
        });
        break;

      default:
        break;
    }
  }
}

Server satisfies Party.Worker;
