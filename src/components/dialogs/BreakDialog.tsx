type BreakDialogProps = {
  activity: string;
  startBreak: () => void;
};

const BreakDialog = ({ activity, startBreak }: BreakDialogProps) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
      <p className="text-white text-lg mb-2">
        Science-Based Wellness Challenge:
      </p>
      <p className="text-yellow-300 text-xl mb-4">{activity}</p>
      <button
        onClick={startBreak}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
      >
        <span className="mr-2">I COMMIT TO THIS CHALLENGE (Y)</span>
        <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
          ✓
        </span>
      </button>
    </div>
  </div>
);

export default BreakDialog;