import React from 'react';

const PersonIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-500 w-full h-full">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 p-1">
        <PersonIcon />
    </div>
);

export const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 p-1">
        <PersonIcon />
    </div>
);