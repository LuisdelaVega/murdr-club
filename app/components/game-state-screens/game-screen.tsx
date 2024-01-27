import { ZOD_STRING, shortUniqueIdOptions } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import type { Player, PlayerKillMessage } from "party/types";
import type PartySocket from "partysocket";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlayerAvatar } from "../player-avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  targetId: ZOD_STRING.schema.length(shortUniqueIdOptions.length ?? 8),
});

interface GameScreenProps {
  player: Player;
  socket: PartySocket;
}

export function GameScreen({ player, socket }: GameScreenProps) {
  const [displayId, setDisplayId] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetId: "",
    },
  });

  function onSubmit({ targetId }: z.infer<typeof formSchema>) {
    if (targetId === player.target?.id || player.target?.id === player.id) {
      socket.send(
        JSON.stringify({
          type: "PlayerKill",
          playerId: player.target.id,
        } as PlayerKillMessage),
      );
    } else {
      form.setError("targetId", {
        message: "The ID you entered doesn't match your target's ID.",
      });
    }
  }

  useEffect(() => {
    setOpenDialog(false);
  }, [player]);

  // TODO Display "You are dead/Killed by" message

  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="flex flex-col gap-1 items-center">
        <PlayerAvatar avatar={player} displayName size="lg" />
        <span
          onClick={(e) => {
            e.preventDefault();
            setDisplayId(!displayId);
          }}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-300"
        >
          ID: {displayId ? player.id : player.id.replaceAll(/./g, "*")}
          {displayId ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </span>
      </div>

      {/* Secrets Drawer */}
      {!player.killedBy && (
        <Drawer>
          <Button asChild>
            <DrawerTrigger className="uppercase">
              View Target and Kill Words
            </DrawerTrigger>
          </Button>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center uppercase">
                For your eyes only
              </DrawerTitle>
              <DrawerDescription className="grid grid-cols-2 grid-rows-1">
                <div className="flex flex-col gap-2 items-center">
                  <h3 className="uppercase">Target</h3>
                  <PlayerAvatar avatar={player.target!} displayName />
                  <div className="flex gap-2">
                    <Button
                      className="w-fit uppercase"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDialog(true);
                      }}
                    >
                      Kill
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <h3 className="uppercase">Kill Words</h3>
                  <div className="flex flex-col gap-1 items-center">
                    {player.killWords.map((word) => (
                      <span
                        key={`${player.victims.length}-${word}`}
                        className="text-lg mt-1 uppercase"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button asChild>
                <DrawerClose className="uppercase">Close</DrawerClose>
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* Victims section */}
      {player.victims.length > 0 && (
        <div className="flex flex-col items-center px-4 gap-2">
          <h2>Victims</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {player.victims.map((victim) => (
              <PlayerAvatar
                avatar={victim}
                key={victim.id}
                size="xs"
                displayName
              />
            ))}
          </div>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kill your target</DialogTitle>
            <DialogDescription>
              Enter your target&apos;s Id and press the Kill button.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Target ID */}
              <FormField
                control={form.control}
                name="targetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase">Target Id</FormLabel>
                    <FormControl>
                      <Input
                        className="uppercase"
                        placeholder={`Enter ${shortUniqueIdOptions.length}-Character Code`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="uppercase">
                      This is your target&apos;s id.
                    </FormDescription>
                    <FormMessage className="uppercase" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="uppercase w-full">
                Kill
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
