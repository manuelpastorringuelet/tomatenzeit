type CompletionDialogProps = {
  activity: string;
  startWork: () => void;
  startLastChance: () => void;
};

const CompletionDialog = ({ activity, startWork, startLastChance }: CompletionDialogProps) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
      <p className="text-white text-lg mb-2">
        Did you complete the challenge?
      </p>
      <p className="text-yellow-300 text-xl mb-4">{activity}</p>
      <div className="flex flex-col space-y-2">
        <button
          onClick={startWork}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
        >
          <span className="mr-2">YES, START WORK</span>
          <span className="w-4 h-4 border-2 border-white flex items-center justify-center">
            ✓
          </span>
        </button>
        <button
          onClick={startLastChance}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
        >
          <span className="mr-2">I&apos;LL DO IT RIGHT NOW</span>
          <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
            ⏱️
          </span>
        </button>
      </div>
    </div>
  </div>
);

export default CompletionDialog;