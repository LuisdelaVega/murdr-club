import type {
  Avatar,
  ClientMessage,
  GameSateMessage,
  GameState,
  Player,
  PlayerUpdatedMessage,
  Players,
  PlayersUpdatedMessage,
} from "common/types";
import { differenceInDays } from "date-fns";
import * as Party from "partykit/server";
import { handleAddPlayer } from "./utils/message-handlers/add-player";
import { handlePlayerKill } from "./utils/message-handlers/player-kill";
import { handleStartGame } from "./utils/message-handlers/start-game";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  gameState: GameState = "WaitingForPlayers";
  players: Players = {};
  lastPlayed: number | undefined = undefined;

  async onStart(): Promise<void> {
    this.lastPlayed = await this.room.storage.get<number>("lastPlayed");

    if (!this.lastPlayed) {
      this.setLastPlayedDate();
    } else if (differenceInDays(Date.now(), this.lastPlayed) < 2) {
      this.players = (await this.room.storage.get<Players>("players")) ?? {};
      this.gameState =
        (await this.room.storage.get<GameState>("gameState")) ??
        "WaitingForPlayers";
    } else {
      // Clear the storage after 2 days have passed
      this.room.storage.deleteAll();
    }
  }

  //#region Getters
  getPlayersArray() {
    return Object.values(this.players);
  }

  getAvatarFromPlayer({ id, image, name, isPartyLeader }: Player): Avatar {
    return {
      id,
      image,
      name,
      isPartyLeader,
    };
  }

  getAvatars(): Avatar[] {
    return this.getPlayersArray().map(this.getAvatarFromPlayer);
  }
  //#endregion

  //#region Setters
  setLastPlayedDate() {
    this.lastPlayed = Date.now();
    this.room.storage.put<number>("lastPlayed", Date.now());
  }
  //#endregion

  //#region Websocket
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

    const gameStateMsg: GameSateMessage = {
      type: this.gameState,
    };

    if (this.gameState === "GameEnded") {
      gameStateMsg.players = this.getPlayersArray();
    }

    // Send the GameState
    connection.send(JSON.stringify(gameStateMsg));

    const player = this.players[connection.id];

    /**
     * This handles the case where a player had been added to the room
     * and they disconnected for some reason (browser refresh, for example).
     */
    if (this.gameState === "GameStarted" && player) {
      connection.send(
        JSON.stringify({
          type: "PlayerUpdated",
          player,
        } as PlayerUpdatedMessage),
      );

      this.setLastPlayedDate();
    }
  }

  async onClose(connection: Party.Connection<unknown>): Promise<void> {
    console.log(`Disconnected: id: ${connection.id} room: ${this.room.id}`);

    const disconnectedPlayer = this.players[connection.id];

    /**
     * This happens when the game has already started and someone else
     * tried to join. No player was added for that connection so
     * `disconnectedPlayer` will be undefined and there's nothing left to do.
     */
    if (!disconnectedPlayer) {
      return;
    }

    const wasPartyLeader = disconnectedPlayer?.isPartyLeader;
    disconnectedPlayer.connected = false;
    disconnectedPlayer.isPartyLeader = false;

    const players = this.getPlayersArray();

    if (wasPartyLeader) {
      for (const player of players) {
        if (player.id !== disconnectedPlayer.id && player.connected) {
          player.isPartyLeader = true;
          break;
        }
      }
    }

    this.room.storage.put<Players>("players", this.players);

    this.room.broadcast(
      JSON.stringify({
        type: "PlayersUpdated",
        avatars: this.getAvatars(),
      } as PlayersUpdatedMessage),
    );
  }

  async onMessage(
    message: string,
    sender: Party.Connection<unknown>,
  ): Promise<void> {
    console.log(`Message from connection with id: ${sender.id}`);
    const data = JSON.parse(message) as ClientMessage;

    switch (data.type) {
      case "AddPlayer":
        handleAddPlayer(this, data, sender);
        break;

      case "StartGame":
        handleStartGame(this);
        break;

      case "PlayerKill":
        handlePlayerKill(this, data, sender);
        break;

      default:
        break;
    }
  }
  //#endregion
}

Server satisfies Party.Worker;
