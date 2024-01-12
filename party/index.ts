import * as Party from "partykit/server";
import {
  type ClientMessage,
  type GameAlreadyStartedMessage,
  type GameSateMessage,
  type GameState,
  type Player,
  type PlayerUpdatedMessage,
  type PlayersUpdatedMessage,
} from "./types";
import { shuffleArray } from "./utils/shuffle-array";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = "WaitingForPlayers";
  players: { [key: string]: Player } = {};

  //#region Websocket
  broadcastToRoom<T>(value: T) {
    this.room.broadcast(JSON.stringify(value));
  }

  async onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext,
  ): Promise<void> {
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

  async onClose(connection: Party.Connection<unknown>): Promise<void> {
    console.log(`Disconnected: id: ${connection.id} room: ${this.room.id}`);

    const disconnectedPlayer = this.players[connection.id];
    const wasPartyLeader = disconnectedPlayer?.isPartyLeader;
    disconnectedPlayer.connected = false;
    disconnectedPlayer.isPartyLeader = false;

    const players = Object.values(this.players);
    if (wasPartyLeader) {
      for (const player of players) {
        if (player.id !== disconnectedPlayer.id && player.connected) {
          player.isPartyLeader = true;
          break;
        }
      }
    }

    this.broadcastToRoom<PlayersUpdatedMessage>({
      type: "PlayersUpdated",
      players,
    });
  }

  async onMessage(
    message: string,
    sender: Party.Connection<unknown>,
  ): Promise<void> {
    console.log(`Message from connection with id: ${sender.id}`);
    const data = JSON.parse(message) as ClientMessage;

    switch (data.type) {
      case "AddPlayer":
        if (this.gameState === "GameStarted") {
          sender.send(
            JSON.stringify({
              type: "GameAlreadyStarted",
            } as GameAlreadyStartedMessage),
          );
          return;
        }

        const {
          player: { id },
        } = data;

        if (!this.players[id]) {
          this.players[id] = data.player;
        }

        this.players[id].connected = true;

        const playersArr = Object.values(this.players);

        if (
          !playersArr.length ||
          !playersArr.find(({ isPartyLeader }) => isPartyLeader)
        ) {
          this.players[id].isPartyLeader = true;
        }

        this.broadcastToRoom<PlayersUpdatedMessage>({
          type: "PlayersUpdated",
          players: Object.values(this.players),
        });
        break;

      case "StartGame":
        this.gameState = "GameStarted";
        this.broadcastToRoom<GameSateMessage>({ type: this.gameState });

        const shuffledPlayers = shuffleArray<Player>(
          Object.values(this.players),
        );

        for (let index = 0; index < shuffledPlayers.length; index++) {
          const player = shuffledPlayers[index];
          const targetPlayer =
            shuffledPlayers[
              index === shuffledPlayers.length - 1 ? 0 : index + 1
            ];

          player.target = {
            id: targetPlayer.id,
            image: targetPlayer.image,
            name: targetPlayer.name,
          };

          this.room.getConnection(player.id)?.send(
            JSON.stringify({
              type: "PlayerUpdated",
              player,
            } as PlayerUpdatedMessage),
          );
        }
        break;

      default:
        break;
    }
  }
  //#endregion
}

Server satisfies Party.Worker;
