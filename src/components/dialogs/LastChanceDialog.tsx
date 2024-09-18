import { formatTime } from "@/utils/timerUtils";

type LastChanceDialogProps = {
  activity: string;
  timeLeft: number;
  completeLastChance: () => void;
};

const LastChanceDialog = ({ activity, timeLeft, completeLastChance }: LastChanceDialogProps) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
      <p className="text-white text-lg mb-2">
        Time to complete the challenge:
      </p>
      <p className="text-yellow-300 text-xl mb-4">{activity}</p>
      <div className="text-6xl font-bold text-white mb-4">
        {formatTime(timeLeft)}
      </div>
      <button
        onClick={completeLastChance}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
      >
        <span className="mr-2">CHALLENGE COMPLETED (Y)</span>
        <span className="w-4 h-4 border-2 border-white flex items-center justify-center">
          ✓
        </span>
      </button>
    </div>
  </div>
);

export default LastChanceDialog;