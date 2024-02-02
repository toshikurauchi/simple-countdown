"use client";

import Countdown from "@/components/countdown";
import { Button } from "@/components/ui/button";
import { type Config, ConfigForm } from "@/fragments/config-form";
import { useState } from "react";
import NewWindow from "react-new-window";

export default function Home() {
  const [showWindow, setShowWindow] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [playing, setPlaying] = useState(false);

  const hours = parseInt(config?.totalTime.split(":")[0] || "0");
  const minutes = parseInt(config?.totalTime.split(":")[1] || "0");
  const seconds = parseInt(config?.totalTime.split(":")[2] || "0");

  function handleCreateOrUpdateWindow(config: Config) {
    setConfig(config);
    setShowWindow(true);
  }

  function handleWindowClose() {
    setShowWindow(false);
    setPlaying(false);
  }

  function handleTogglePlaying() {
    setPlaying((prev) => !prev);
  }

  return (
    <main className="flex min-h-screen flex-col p-24 max-w-lg mx-auto">
      <h1 className={`mb-8 text-4xl font-bold`}>Simple Countdown</h1>
      <ConfigForm
        onConfigChanged={handleCreateOrUpdateWindow}
        buttonText={showWindow ? "Update countdown" : "Open countdown"}
      />

      <div className="flex mt-4">
        <Button onClick={handleTogglePlaying} disabled={!showWindow}>
          {playing ? "Pause" : "Play"}
        </Button>
      </div>

      {showWindow && (
        <NewWindow title="Countdown" onUnload={handleWindowClose}>
          <Countdown
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            showLabels={config?.showLabels}
            onTogglePlaying={handleTogglePlaying}
            playing={playing}
          />
        </NewWindow>
      )}
    </main>
  );
}
