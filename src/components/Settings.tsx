import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Customize
      </button>
    </div>
  );
};

export default Settings;