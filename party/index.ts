import * as Party from "partykit/server";
import {
  ClientMessage,
  GameSateMessage,
  GameState,
  GetGameStateResponse,
  Player,
  PlayersUpdatedMessage,
} from "./types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = "WaitingForPlayers";
  players: { [key: string]: Player } = {};

  //#region HTTP
  onRequest(req: Party.Request): Response | Promise<Response> {
    if (req.method === "GET") {
      console.log("Received HTTP request");
      return new Response(
        JSON.stringify({ gameState: this.gameState } as GetGameStateResponse),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response("Not found", { status: 404 });
  }
  //#endregion

  //#region Websocket
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

    this.broadcastToRoom<GameSateMessage>({
      type: this.gameState,
    });
  }

  onClose(connection: Party.Connection<unknown>): void | Promise<void> {
    console.log(`Disconnected: id: ${connection.id} room: ${this.room.id}`);

    const wasPartyLeader = this.players[connection.id]?.isPartyLeader;
    this.players[connection.id].connected = false;
    this.players[connection.id].isPartyLeader = false;

    if (wasPartyLeader) {
      for (const id of Object.keys(this.players)) {
        if (id !== connection.id && this.players[id].connected) {
          this.players[id].isPartyLeader = true;
          break;
        }
      }
    }

    this.broadcastToRoom<PlayersUpdatedMessage>({
      type: "PlayersUpdated",
      players: Object.values(this.players),
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

        if (!this.players[player.id]) {
          this.players[player.id] = player;
        }

        this.players[player.id].connected = true;

        const playersArr = Object.values(this.players);

        if (
          !playersArr.length ||
          !playersArr.find(({ isPartyLeader }) => isPartyLeader)
        ) {
          this.players[player.id].isPartyLeader = true;
        }

        this.broadcastToRoom<PlayersUpdatedMessage>({
          type: "PlayersUpdated",
          players: Object.values(this.players),
        });
        break;

      case "StartGame":
        this.gameState = "GameStarted";
        this.broadcastToRoom<GameSateMessage>({ type: this.gameState });
        break;

      default:
        break;
    }
  }
  //#endregion
}

Server satisfies Party.Worker;
