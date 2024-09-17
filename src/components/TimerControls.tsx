type TimerControlsProps = {
  isActive: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
};

const TimerControls = ({
  isActive,
  toggleTimer,
  resetTimer,
}: TimerControlsProps) => (
  <div className="flex justify-center space-x-4 mb-4">
    <button
      onClick={toggleTimer}
      className={`${
        isActive
          ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-700"
          : "bg-green-500 hover:bg-green-600 border-green-700"
      } text-white font-bold py-2 px-4 rounded border-b-4 active:border-b-2 active:translate-y-0.5 transition-all`}
    >
      {isActive ? "PAUSE" : "START"}
    </button>
    <button
      onClick={resetTimer}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 active:border-b-2 active:translate-y-0.5 transition-all"
    >
      RESET
    </button>
  </div>
);

export default TimerControls;