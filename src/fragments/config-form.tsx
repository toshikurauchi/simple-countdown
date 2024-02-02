"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  totalTime: z
    .string()
    .transform((val) => {
      return val.split(":").map((v) => parseInt(v));
    })
    .refine(
      (parts) => {
        return parts.length <= 3;
      },
      {
        message: "Invalid time format. Please use HH:MM:SS, MM:SS, or SS.",
      }
    )
    .refine(
      (parts) => {
        const seconds = parts[parts.length - 1] || 0;
        return seconds >= 0 && seconds < 60;
      },
      {
        message: "Seconds must be a number between 0 and 59.",
      }
    )
    .refine(
      (parts) => {
        const minutes = parts[parts.length - 2] || 0;
        return minutes >= 0 && minutes < 60;
      },
      {
        message: "Minutes must be a number between 0 and 59.",
      }
    )
    .refine(
      (parts) => {
        const hours = parts[parts.length - 3] || 0;
        return hours >= 0 && hours < 99;
      },
      {
        message: "Hours must be a number between 0 and 99.",
      }
    )
    .transform((val) => val.join(":")),
  showLabels: z.boolean().default(false),
  soundEnabled: z.boolean().default(false),
});

export type Config = z.infer<typeof formSchema>;

interface ConfigFormProps {
  buttonText: string;
  onConfigChanged: (config: Config) => void;
}

export function ConfigForm({ onConfigChanged, buttonText }: ConfigFormProps) {
  const form = useForm<Config>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalTime: "00:00:10",
    },
  });

  function onSubmit(values: Config) {
    onConfigChanged(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="totalTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input placeholder="00:00:00" {...field} />
              </FormControl>
              <FormDescription>
                Accepted formats: HH:MM:SS, MM:SS, SS, S
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="showLabels"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal ml-2">
                Show labels (Hours, Minutes, Seconds)
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="soundEnabled"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal ml-2">
                Sound enabled
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{buttonText}</Button>
      </form>
    </Form>
  );
}
