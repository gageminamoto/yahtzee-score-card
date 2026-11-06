/**
 * Settings Context Provider
 * Manages global settings state and persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadSettings, saveSettings, resetSettings } from '../utils/storage';
import { FONT_SIZE_MULTIPLIERS } from '../utils/defaultSettings';
import { enableNoSleep, disableNoSleep } from '../utils/noSleep';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings());

  // Auto-save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
    applyThemeSettings(settings);
  }, [settings]);

  // Apply theme settings on mount
  useEffect(() => {
    applyThemeSettings(settings);
  }, []);

  // Manage wake lock based on setting
  useEffect(() => {
    if (settings.accessibility.keepScreenAwake) {
      enableNoSleep();
    } else {
      disableNoSleep();
    }
  }, [settings.accessibility.keepScreenAwake]);

  /**
   * Update a specific setting
   */
  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  /**
   * Update multiple settings at once
   */
  const updateSettings = (updates) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      Object.keys(updates).forEach(category => {
        newSettings[category] = {
          ...prev[category],
          ...updates[category],
        };
      });
      return newSettings;
    });
  };

  /**
   * Reset all settings to defaults
   */
  const resetAllSettings = () => {
    const defaults = resetSettings();
    setSettings(defaults);
    applyThemeSettings(defaults);
  };

  const value = {
    settings,
    updateSetting,
    updateSettings,
    resetAllSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to access settings context
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

/**
 * Apply theme settings to CSS variables and document
 */
function applyThemeSettings(settings) {
  const root = document.documentElement;

  // Font size multiplier
  const fontMultiplier = FONT_SIZE_MULTIPLIERS[settings.visual.fontSize];
  root.style.setProperty('--font-size-multiplier', fontMultiplier);

  // Reduce motion: zero the shared animation duration and disable
  // animations/transitions app-wide (see .reduced-motion in index.css)
  root.style.setProperty('--animation-duration', settings.visual.reducedMotion ? '0ms' : '500ms');
  root.classList.toggle('reduced-motion', settings.visual.reducedMotion);

  // Dark mode darkens surface colours (see hooks/useSurface.js); no class needed.
  root.classList.remove('dark');
}

/**
 * Trigger haptic feedback if enabled
 */
export function triggerHaptic(settings) {
  if (!settings?.accessibility?.enableHapticFeedback) return;

  // Check if vibration API is available
  if ('vibrate' in navigator) {
    navigator.vibrate(10); // 10ms vibration
  }
}

