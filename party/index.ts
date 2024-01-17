import * as Party from "partykit/server";
import {
  type ClientMessage,
  type GameSateMessage,
  type GameState,
  type Player,
  type PlayerUpdatedMessage,
  type PlayersUpdatedMessage,
  type TooLateMessage,
} from "./types";
import { generateKillWords } from "./utils/generate-kill-words";
import { shuffleArray } from "./utils/shuffle-array";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = "WaitingForPlayers";
  players: { [key: string]: Player } = {};

  //#region Websocket
  broadcastToRoom<T>(value: T) {
    this.room.broadcast(JSON.stringify(value));
  }

  getAvatars() {
    return Object.values(this.players).map(
      ({ id, image, name, isPartyLeader }) => ({
        id,
        image,
        name,
        isPartyLeader,
      }),
    );
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

    const player = this.players[connection.id];

    if (this.gameState === "GameStarted" && player) {
      connection.send(
        JSON.stringify({
          type: "PlayerUpdated",
          player,
        } as PlayerUpdatedMessage),
      );
    }
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
      avatars: this.getAvatars(),
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
        const {
          avatar: { id },
        } = data;

        // If the game has already started and a new player is trying to join, don't allow it
        if (this.gameState === "GameStarted" && !this.players[id]) {
          sender.send(
            JSON.stringify({
              type: "TooLate",
            } as TooLateMessage),
          );
          return;
        }

        if (!this.players[id]) {
          this.players[id] = {
            ...data.avatar,
            connected: true,
            isAlive: true,
            killWords: generateKillWords(id),
            target: undefined,
            victims: [],
          };
        }

        this.players[id].connected = true;

        const players = Object.values(this.players);

        if (
          !players.length ||
          !players.find(({ isPartyLeader }) => isPartyLeader)
        ) {
          this.players[id].isPartyLeader = true;
        }

        this.broadcastToRoom<PlayersUpdatedMessage>({
          type: "PlayersUpdated",
          avatars: this.getAvatars(),
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
