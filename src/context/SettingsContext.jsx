/**
 * Settings Context Provider
 * Manages global settings state and persistence
 */

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadSettings, saveSettings } from '../utils/storage';
import { FONT_SIZE_MULTIPLIERS } from '../utils/defaultSettings';

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
    const { resetSettings } = require('../utils/storage');
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

  // Button size
  const buttonHeight = settings.accessibility.largeButtons ? '80px' : '60px';
  root.style.setProperty('--button-min-height', buttonHeight);

  // Animation duration (0 if disabled)
  const animationDuration = settings.visual.enableAnimations && !settings.visual.reducedMotion
    ? '500ms'
    : '0ms';
  root.style.setProperty('--animation-duration', animationDuration);

  // Reduced motion (system preference override)
  if (settings.visual.reducedMotion) {
    root.style.setProperty('--animation-duration', '0ms');
    root.classList.add('reduced-motion');
  } else {
    root.classList.remove('reduced-motion');
  }

  // High contrast mode
  if (settings.accessibility.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Dark mode
  if (settings.visual.enableDarkMode) {
    root.classList.add('dark-mode');
  } else {
    root.classList.remove('dark-mode');
  }
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
