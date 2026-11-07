/**
 * Settings page: one scrolling list of setting groups.
 */

import PropTypes from 'prop-types';
import { Button, Card, PageHeader } from '../components';
import SettingToggle from '../components/SettingToggle';
import SettingButtonGroup from '../components/SettingButtonGroup';
import SettingNumberInput from '../components/SettingNumberInput';
import ColorSchemeCard from '../components/ColorSchemeCard';
import { useSettings } from '../context/SettingsContext';
import { usePageSurface } from '../hooks/useSurface';
import { COLOR_SCHEMES, FONT_SIZE_OPTIONS, HEADER_STYLE_OPTIONS } from '../utils/defaultSettings';
import { clearAllData, exportAllData } from '../utils/storage';

function SettingSection({ title, children }) {
  return (
    <section>
      <h2 className="font-sans text-ui font-bold uppercase tracking-wider text-fg/70 mb-2">
        {title}
      </h2>
      <Card padding="small">{children}</Card>
    </section>
  );
}

SettingSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Settings({ onBack, colorIndex }) {
  const { settings, updateSetting, resetAllSettings } = useSettings();
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

  return (
    <div
      className="min-h-dvh p-4 md:p-8 text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      <div className="max-w-2xl mx-auto">
        <PageHeader title="SETTINGS" onBack={onBack} className="mb-6" />

        <div className="space-y-6">
          <SettingSection title="Appearance">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 pb-3 border-b-2 border-fg/20">
              {Object.entries(COLOR_SCHEMES).map(([scheme, label]) => (
                <ColorSchemeCard
                  compact
                  key={scheme}
                  scheme={scheme}
                  label={label}
                  isSelected={settings.visual.colorScheme === scheme}
                  onClick={() => updateSetting('visual', 'colorScheme', scheme)}
                />
              ))}
            </div>
            <SettingToggle
              label="Dark Mode"
              enabled={settings.visual.enableDarkMode}
              onChange={(value) => updateSetting('visual', 'enableDarkMode', value)}
            />
            <SettingButtonGroup
              label="Text Size"
              value={settings.visual.fontSize}
              options={FONT_SIZE_OPTIONS}
              onChange={(value) => updateSetting('visual', 'fontSize', value)}
            />
            <SettingButtonGroup
              label="Title Style"
              value={settings.visual.headerStyle}
              options={HEADER_STYLE_OPTIONS}
              onChange={(value) => updateSetting('visual', 'headerStyle', value)}
            />
            <SettingToggle
              label="Reduce Motion"
              description="Also skips the winner reveal"
              enabled={settings.visual.reducedMotion}
              onChange={(value) => updateSetting('visual', 'reducedMotion', value)}
            />
          </SettingSection>

          <SettingSection title="Game">
            <SettingToggle
              label="Header Totals"
              description="Show totals in the game header"
              enabled={settings.visual.showHeaderTotals}
              onChange={(value) => updateSetting('visual', 'showHeaderTotals', value)}
            />
            <SettingNumberInput
              label="Bonus Threshold"
              description="Upper section target"
              value={settings.gameRules.upperBonusThreshold}
              min={0}
              max={100}
              onChange={(value) => updateSetting('gameRules', 'upperBonusThreshold', value)}
            />
            <SettingNumberInput
              label="Bonus Points"
              value={settings.gameRules.upperBonusPoints}
              min={0}
              max={100}
              onChange={(value) => updateSetting('gameRules', 'upperBonusPoints', value)}
            />
          </SettingSection>

          <SettingSection title="Feedback">
            <SettingToggle
              label="Sound Effects"
              enabled={settings.accessibility.enableSoundEffects}
              onChange={(value) => updateSetting('accessibility', 'enableSoundEffects', value)}
            />
            {'vibrate' in navigator && (
              <SettingToggle
                label="Haptic Feedback"
                enabled={settings.accessibility.enableHapticFeedback}
                onChange={(value) => updateSetting('accessibility', 'enableHapticFeedback', value)}
              />
            )}
            <SettingToggle
              label="Keep Screen Awake"
              description="Stops the screen from sleeping"
              enabled={settings.accessibility.keepScreenAwake}
              onChange={(value) => updateSetting('accessibility', 'keepScreenAwake', value)}
            />
          </SettingSection>

          <SettingSection title="Data">
            <SettingToggle
              label="Save Game History"
              enabled={settings.data.saveGameHistory}
              onChange={(value) => updateSetting('data', 'saveGameHistory', value)}
            />
            {settings.data.saveGameHistory && (
              <SettingNumberInput
                label="Max History Size"
                value={settings.data.maxHistorySize}
                min={10}
                max={100}
                onChange={(value) => updateSetting('data', 'maxHistorySize', value)}
              />
            )}
            <div className="flex flex-wrap gap-2 py-3">
              <Button variant="outline" size="small" className="flex-1 px-2 py-2 leading-tight" onClick={handleExportData}>
                Export
              </Button>
              <Button variant="outline" size="small" className="flex-1 px-2 py-2 leading-tight" onClick={resetAllSettings}>
                Reset settings
              </Button>
              <Button variant="outline" size="small" className="flex-1 px-2 py-2 leading-tight" onClick={handleClearAllData}>
                Clear data
              </Button>
            </div>
          </SettingSection>

          <p className="font-sans text-ui text-fg/70 text-center">
            Yahtzee Score Tracker · Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

Settings.propTypes = {
  onBack: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
