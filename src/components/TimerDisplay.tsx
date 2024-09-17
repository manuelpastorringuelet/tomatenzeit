import Image from "next/image";
import { formatTime } from "@/utils/timerUtils";

type TimerDisplayProps = {
  imageUrl: string;
  mode: "work" | "short_break" | "long_break";
  timeLeft: number;
  completedPomodoros: number;
};

const TimerDisplay = ({
  imageUrl,
  mode,
  timeLeft,
  completedPomodoros,
}: TimerDisplayProps) => (
  <div className="bg-green-300 p-6 rounded mb-6">
    <Image
      src={imageUrl}
      alt="Pomodoro Wellness"
      width={200}
      height={200}
      className="mx-auto mb-6 rounded pixelated"
    />
    <h2 className="text-3xl font-bold mb-4 text-black uppercase">
      {mode === "work" ? "Focus Time" : "Recharge Time"}
    </h2>
    <div className="text-7xl font-bold text-black bg-green-100 p-4 rounded">
      {formatTime(timeLeft)}
    </div>
    <div className="mt-4 text-xl font-bold text-black">
      Pomodoros: {completedPomodoros}
    </div>
  </div>
);

export default TimerDisplay;