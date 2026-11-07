/**
 * Settings page with comprehensive customization options
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, PageHeader } from '../components';
import SettingToggle from '../components/SettingToggle';
import SettingButtonGroup from '../components/SettingButtonGroup';
import SettingNumberInput from '../components/SettingNumberInput';
import ColorSchemeCard from '../components/ColorSchemeCard';
import { useSettings } from '../context/SettingsContext';
import { usePageSurface } from '../hooks/useSurface';
import { cn } from '../utils/cn';
import { COLOR_SCHEMES, FONT_SIZE_OPTIONS, HEADER_STYLE_OPTIONS } from '../utils/defaultSettings';
import { clearAllData, exportAllData } from '../utils/storage';

export default function Settings({ onBack, colorIndex }) {
  const { settings, updateSetting, resetAllSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('appearance');
  const { style: surfaceStyle } = usePageSurface(colorIndex);

  const handleExportData = () => {
    const data = exportAllData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yahtzee-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all data? This will reset settings, delete saved games, and clear history. This cannot be undone.'
      )
    ) {
      clearAllData();
      resetAllSettings();
      alert('All data has been cleared and settings reset to defaults.');
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'rules', label: 'Rules' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'data', label: 'Data' },
  ];

  return (
    <div
      className="min-h-dvh p-4 md:p-8 text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      <div className="max-w-4xl mx-auto">
        <PageHeader title="SETTINGS" onBack={onBack} className="mb-6" />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-fg/10 p-1" role="tablist" aria-label="Settings sections">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-3 font-sans text-body font-bold whitespace-nowrap transition-colors',
                activeTab === tab.id ? 'bg-fg text-surface' : 'text-fg/70 hover:text-fg hover:bg-fg/10',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                COLOR SCHEME
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(COLOR_SCHEMES).map(([scheme, label]) => (
                  <ColorSchemeCard
                    key={scheme}
                    scheme={scheme}
                    label={label}
                    isSelected={settings.visual.colorScheme === scheme}
                    onClick={() => updateSetting('visual', 'colorScheme', scheme)}
                  />
                ))}
              </div>
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                DISPLAY
              </h2>
              <SettingButtonGroup
                label="Font Size"
                description="Adjust text size throughout the app"
                value={settings.visual.fontSize}
                options={FONT_SIZE_OPTIONS}
                onChange={(value) => updateSetting('visual', 'fontSize', value)}
              />
              <SettingButtonGroup
                label="Header Style"
                description="Choose the title style on the home screen"
                value={settings.visual.headerStyle}
                options={HEADER_STYLE_OPTIONS}
                onChange={(value) => updateSetting('visual', 'headerStyle', value)}
              />
              <SettingToggle
                label="Dark Mode"
                description="Use darker colors for backgrounds"
                enabled={settings.visual.enableDarkMode}
                onChange={(value) => updateSetting('visual', 'enableDarkMode', value)}
              />
              <SettingToggle
                label="Header Totals"
                description="Show player total scores in the game header"
                enabled={settings.visual.showHeaderTotals}
                onChange={(value) => updateSetting('visual', 'showHeaderTotals', value)}
              />
              <SettingToggle
                label="High Contrast"
                description="Stronger borders and no transparency for better visibility"
                enabled={settings.accessibility.highContrast}
                onChange={(value) => updateSetting('accessibility', 'highContrast', value)}
              />
              <SettingToggle
                label="Large Touch Targets"
                description="Increase button sizes for easier tapping"
                enabled={settings.accessibility.largeButtons}
                onChange={(value) => updateSetting('accessibility', 'largeButtons', value)}
              />
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                EFFECTS
              </h2>
              <SettingToggle
                label="Animations"
                description="Enable smooth transitions and effects"
                enabled={settings.visual.enableAnimations}
                onChange={(value) => updateSetting('visual', 'enableAnimations', value)}
              />
              <SettingToggle
                label="Confetti"
                description="Show celebration animation on winner screen"
                enabled={settings.visual.enableConfetti}
                onChange={(value) => updateSetting('visual', 'enableConfetti', value)}
              />
              <SettingToggle
                label="Reduced Motion"
                description="Disables animations above for accessibility"
                enabled={settings.visual.reducedMotion}
                onChange={(value) => updateSetting('visual', 'reducedMotion', value)}
              />
            </Card>
          </div>
        )}

        {/* Game Rules Settings */}
        {activeTab === 'rules' && (
          <div className="space-y-6">
            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                SCORING
              </h2>
              <SettingNumberInput
                label="Upper Bonus Threshold"
                description="Points needed in upper section to earn bonus"
                value={settings.gameRules.upperBonusThreshold}
                min={0}
                max={100}
                onChange={(value) => updateSetting('gameRules', 'upperBonusThreshold', value)}
              />
              <SettingNumberInput
                label="Upper Bonus Points"
                description="Points awarded when threshold is reached"
                value={settings.gameRules.upperBonusPoints}
                min={0}
                max={100}
                onChange={(value) => updateSetting('gameRules', 'upperBonusPoints', value)}
              />
              <SettingNumberInput
                label="Yahtzee Bonus"
                description="Points for additional Yahtzees after the first"
                value={settings.gameRules.yahtzeeBonus}
                min={0}
                max={200}
                onChange={(value) => updateSetting('gameRules', 'yahtzeeBonus', value)}
              />
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                HOUSE RULES
              </h2>
              <SettingToggle
                label="Yahtzee Joker Rule"
                description="Use Yahtzee as any category when Yahtzee is already scored"
                enabled={settings.gameRules.enableYahtzeeJoker}
                onChange={(value) => updateSetting('gameRules', 'enableYahtzeeJoker', value)}
              />
              <SettingToggle
                label="Force Zero Scoring"
                description="Must score 0 when no valid score is possible (official rule)"
                enabled={settings.gameRules.enableForcedZeros}
                onChange={(value) => updateSetting('gameRules', 'enableForcedZeros', value)}
              />
            </Card>
          </div>
        )}

        {/* Feedback Settings */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                FEEDBACK
              </h2>
              {'vibrate' in navigator && (
                <SettingToggle
                  label="Haptic Feedback"
                  description="Vibrate on interactions (mobile devices)"
                  enabled={settings.accessibility.enableHapticFeedback}
                  onChange={(value) => updateSetting('accessibility', 'enableHapticFeedback', value)}
                />
              )}
              <SettingToggle
                label="Sound Effects"
                description="Play audio feedback such as the winner fanfare"
                enabled={settings.accessibility.enableSoundEffects}
                onChange={(value) => updateSetting('accessibility', 'enableSoundEffects', value)}
              />
              <SettingToggle
                label="Keep Screen Awake"
                description="Prevent device from sleeping while using the app"
                enabled={settings.accessibility.keepScreenAwake}
                onChange={(value) => updateSetting('accessibility', 'keepScreenAwake', value)}
              />
            </Card>
          </div>
        )}

        {/* Data Settings */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                SAVE & HISTORY
              </h2>
              <SettingToggle
                label="Auto-Save"
                description="Automatically save game progress and resume on reload"
                enabled={settings.data.autoSaveEnabled}
                onChange={(value) => updateSetting('data', 'autoSaveEnabled', value)}
              />
              <SettingToggle
                label="History"
                description="Save completed games to view later"
                enabled={settings.data.saveGameHistory}
                onChange={(value) => updateSetting('data', 'saveGameHistory', value)}
              />
              <SettingNumberInput
                label="Max History Size"
                description="Maximum number of games to store"
                value={settings.data.maxHistorySize}
                min={10}
                max={100}
                onChange={(value) => updateSetting('data', 'maxHistorySize', value)}
              />
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                DATA MANAGEMENT
              </h2>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="large"
                  fullWidth
                  onClick={handleExportData}
                >
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  fullWidth
                  onClick={handleClearAllData}
                >
                  Clear All Data
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  fullWidth
                  onClick={resetAllSettings}
                >
                  Reset Settings to Defaults
                </Button>
              </div>
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                ABOUT
              </h2>
              <div className="space-y-3 font-sans text-body">
                <p>
                  <strong>Yahtzee Score Tracker</strong>
                </p>
                <p className="text-fg/70">Version 1.0.0</p>
                <p className="text-fg/70">
                  A modern, colorful score tracking app for Yahtzee with customizable
                  settings and game rules.
                </p>
              </div>
            </Card>

            <Card padding="medium">
              <h2 className="font-serif text-subtitle mb-4 text-balance">
                GAME RULES
              </h2>
              <div className="space-y-3 font-sans text-body">
                <p>
                  <strong>Objective:</strong> Score the most points by rolling five dice
                  to make certain combinations.
                </p>
                <p>
                  <strong>Gameplay:</strong> Each turn, roll up to 3 times. After rolling,
                  choose a category to score. Each category can only be used once.
                </p>
                <p>
                  <strong>Upper Section:</strong> Score the sum of dice showing that
                  number (Ones through Sixes). Get 35+ bonus points if your upper section
                  totals 63 or more.
                </p>
                <p>
                  <strong>Lower Section:</strong> Score special combinations like Three
                  of a Kind, Full House, Straights, and Yahtzee (five of a kind).
                </p>
                <p>
                  <strong>Winning:</strong> The player with the highest total score after
                  all 13 categories are filled wins!
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

Settings.propTypes = {
  onBack: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
