'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';



interface Settings {
  darkMode: boolean;
  fontSize: string;
  language: string;
}
interface SettingsContextType {
  darkMode: boolean;
  fontSize: string;
  language: string;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    darkMode: true,
    fontSize: 'medium',
    language: 'en'
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  // Fetch settings from database when session changes
  useEffect(() => {
    if (session?.user?.email) {
      fetchUserSettings(session.user.email);
    }
  }, [session]);

  const fetchUserSettings = async (email: string) => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      const newSettings = {
        darkMode: data.theme === 'dark',
        fontSize: data.fontSize,
        language: data.language
      };
      setSettings(newSettings);
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      // Update local state and localStorage
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

      // Update database if user is authenticated
      if (session?.user?.email) {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            theme: updatedSettings.darkMode ? 'dark' : 'light',
            fontSize: updatedSettings.fontSize,
            language: updatedSettings.language
          })
        });
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};