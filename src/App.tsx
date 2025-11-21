import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
          WP Chatbot Admin
        </h1>
        <p className="text-gray-600 text-center mb-8">
          React + TypeScript + Tailwind CSS
        </p>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 mb-6">
          <p className="text-white text-center text-sm font-medium mb-2">
            Counter
          </p>
          <p className="text-white text-center text-6xl font-bold">
            {count}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={handleDecrement}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            -
          </button>
          <button
            onClick={handleIncrement}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            +
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Reset
        </button>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>React 19</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span>TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

