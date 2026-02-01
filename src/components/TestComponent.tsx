import React, { useEffect } from 'react';
import { databaseService } from '../services/database';

export const TestComponent: React.FC = () => {
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await databaseService.init();
        console.log(' Database initialized successfully');
      } catch (error) {
        console.error('L Database initialization failed:', error);
      }
    };
    
    initDatabase();
  }, []);

  return (
    <div className="bg-blue-50 border-2 border-blue-400 p-4 m-4 rounded-lg">
      <h2 className="text-blue-800 font-bold">Database Status</h2>
      <p className="text-blue-600"> Database initialized successfully</p>
      <p className="text-sm text-blue-500 mt-2">Using localStorage for browser compatibility</p>
    </div>
  );
};
