import React, { useState } from 'react';

const SettingsPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [privacy, setPrivacy] = useState('public');

  const saveSettings = () => {
    console.log('Settings saved:', { username, email, notifications, privacy });
    alert('Settings saved!');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-8">
      <h1 className="text-2xl font-bold text-center">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <label className="block text-gray-700">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-700">Enable Notifications</span>
        </label>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Privacy Settings</h2>
        <label className="block text-gray-700">Privacy Level:</label>
        <select
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <button
        onClick={saveSettings}
        className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SettingsPage;
