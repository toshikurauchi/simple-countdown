import { KeyboardEvent, useEffect, useRef, useState } from "react";

type CountdownProps = {
  hours: number;
  minutes: number;
  seconds: number;
  onTogglePlaying: () => void;
  playing: boolean;
  soundEnabled?: boolean;
  showLabels?: boolean;
};

function getDigit(number: number, position: number) {
  return Math.floor((number / Math.pow(10, position)) % 10);
}

function computeTotalTimeInSeconds(
  hours: number,
  minutes: number,
  seconds: number
) {
  return hours * 60 * 60 + minutes * 60 + seconds;
}

function getHours(seconds: number) {
  return Math.floor(seconds / 3600);
}

function getMinutes(seconds: number) {
  return Math.floor((seconds % 3600) / 60);
}

function getSeconds(seconds: number) {
  return seconds % 60;
}

export default function Countdown({
  hours,
  minutes,
  seconds,
  showLabels,
  onTogglePlaying,
  soundEnabled,
  playing,
}: CountdownProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playedSound, setPlayedSound] = useState(false);

  const [startTime, setStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(
    computeTotalTimeInSeconds(hours, minutes, seconds)
  );
  const [remainingTime, setRemainingTime] = useState(totalTime);

  useEffect(() => {
    setRemainingTime(computeTotalTimeInSeconds(hours, minutes, seconds));
    setPlayedSound(false);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    if (playing) {
      setStartTime(Date.now());
      setTotalTime(remainingTime);
    }
  }, [playing]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing) {
        const ellapsedTime = Math.max(0, Date.now() - startTime);
        const remainingTime = Math.max(0, totalTime - ellapsedTime / 1000);
        setRemainingTime(remainingTime);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [playing, startTime, totalTime]);

  useEffect(() => {
    if (playing && remainingTime === 0 && !playedSound && soundEnabled) {
      audioRef.current?.play();
      setPlayedSound(true);
    }
  }, [playing, remainingTime, playedSound, soundEnabled]);

  function handleKeyDown(ev: KeyboardEvent<HTMLDivElement>) {
    if (ev.key === " ") {
      onTogglePlaying();
    }
  }

  const remainingHours = getHours(remainingTime);
  const remainingMinutes = getMinutes(remainingTime);
  const remainingSeconds = getSeconds(remainingTime);

  const seconds0 = getDigit(remainingSeconds, 1);
  const seconds1 = getDigit(remainingSeconds, 0);
  const minutes0 = getDigit(remainingMinutes, 1);
  const minutes1 = getDigit(remainingMinutes, 0);
  const hours0 = getDigit(remainingHours, 1);
  const hours1 = getDigit(remainingHours, 0);

  const labelStyle = {
    fontSize: `clamp(1rem, ${
      5 + (remainingHours <= 0 ? (remainingMinutes <= 0 ? 2 : 1) : 0) * 2
    }vw, 10rem)`,
  };

  return (
    <div
      className="flex flex-col items-center space-y-4 min-h-screen justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{
        fontSize: `clamp(1rem, ${
          20 + (remainingHours <= 0 ? (remainingMinutes <= 0 ? 2 : 1) : 0) * 10
        }vw, 30rem)`,
      }}
    >
      <audio src="/sounds/alarm-clock-short-6402.mp3" ref={audioRef} />
      <div className="flex">
        {remainingHours > 0 && (
          <div className="flex flex-col items-center">
            <div className="font-bold">
              <span>{hours0}</span>
              <span>{hours1}</span>
              <span className="opacity-50">:</span>
            </div>
            {showLabels && (
              <span className="font-semibold" style={labelStyle}>
                Hours
              </span>
            )}
          </div>
        )}
        {(remainingMinutes > 0 || remainingHours > 0) && (
          <div className="flex flex-col items-center">
            <div className="font-bold">
              <span>{minutes0}</span>
              <span>{minutes1}</span>
              <span className="opacity-50">:</span>
            </div>
            {showLabels && (
              <span className="font-semibold" style={labelStyle}>
                Minutes
              </span>
            )}
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="font-bold">
            <span>{seconds0}</span>
            <span>{seconds1}</span>
          </div>
          {showLabels && (
            <span className="font-semibold" style={labelStyle}>
              Seconds
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
