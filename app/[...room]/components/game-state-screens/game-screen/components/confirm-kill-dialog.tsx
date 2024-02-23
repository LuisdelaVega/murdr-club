import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ZOD_STRING, shortUniqueIdOptions } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Skull } from "lucide-react";
import type { Player, PlayerKillMessage } from "party/types";
import type PartySocket from "partysocket";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  targetId: ZOD_STRING.schema.length(shortUniqueIdOptions.length ?? 8),
});

interface Props {
  player: Player;
  socket: PartySocket;
  open: DialogProps["open"];
  onOpenChange: DialogProps["onOpenChange"];
}

export function ConfirmKillDialog({ player, socket, ...dialogProps }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetId: "",
    },
  });

  function onSubmit({ targetId }: z.infer<typeof formSchema>) {
    if (targetId === player.target?.id || player.target?.id === player.id) {
      form.clearErrors("targetId");
      form.reset({
        targetId: "",
      });

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

  if (player.killedBy) {
    return null;
  }

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Kill</DialogTitle>
          <DialogDescription>Enter your target&apos;s Id.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Target ID */}
            <FormField
              control={form.control}
              name="targetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${shortUniqueIdOptions.length}-Character Code`}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your target&apos;s id.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              <Skull className="w-4 h-4 mr-2" />
              Confirm Kill
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
