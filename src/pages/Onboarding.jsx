import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, PageHeader } from '../components';
import SettingToggle from '../components/SettingToggle';
import ColorSchemeCard from '../components/ColorSchemeCard';
import { getColorByScheme } from '../utils/colors';
import { usePageSurface } from '../hooks/useSurface';
import { useSettings } from '../context/SettingsContext';
import { COLOR_SCHEMES } from '../utils/defaultSettings';

export default function Onboarding({ onComplete, colorIndex }) {
  const { settings, updateSetting } = useSettings();
  const [localColorScheme, setLocalColorScheme] = useState(settings.visual.colorScheme);
  const { style: surfaceStyle } = usePageSurface(getColorByScheme(colorIndex, localColorScheme));

  const handleColorSchemeChange = (scheme) => {
    setLocalColorScheme(scheme);
    updateSetting('visual', 'colorScheme', scheme);
  };

  const handleFinish = () => {
    updateSetting('preferences', 'showTutorial', false);
    onComplete();
  };

  return (
    <div
      className="min-h-dvh p-4 md:p-8 text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="WELCOME"
          description="Let's set up a few things before you start."
          actions={(
            <Button variant="ghost" size="small" onClick={handleFinish} className="text-body">
              Skip
            </Button>
          )}
        />

        {/* Settings Sections */}
        <div className="space-y-6 mb-12">
          <Card padding="medium">
            <h2 className="font-serif text-subtitle mb-4 text-balance">
              LOOK & FEEL
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {Object.entries(COLOR_SCHEMES).map(([scheme, label]) => (
                <ColorSchemeCard
                  key={scheme}
                  scheme={scheme}
                  label={label}
                  isSelected={localColorScheme === scheme}
                  onClick={() => handleColorSchemeChange(scheme)}
                />
              ))}
            </div>
            <SettingToggle
              label="Dark Mode"
              description="Use darker colors for backgrounds"
              enabled={settings.visual.enableDarkMode}
              onChange={(value) => updateSetting('visual', 'enableDarkMode', value)}
            />
          </Card>

          <Card padding="medium">
            <h2 className="font-serif text-subtitle mb-4 text-balance">
              SOUND & FEEDBACK
            </h2>
            <SettingToggle
              label="Sound Effects"
              description="Play audio feedback such as the winner fanfare"
              enabled={settings.accessibility.enableSoundEffects}
              onChange={(value) => updateSetting('accessibility', 'enableSoundEffects', value)}
            />
            {'vibrate' in navigator && (
              <SettingToggle
                label="Haptic Feedback"
                description="Vibrate on interactions (mobile devices)"
                enabled={settings.accessibility.enableHapticFeedback}
                onChange={(value) => updateSetting('accessibility', 'enableHapticFeedback', value)}
              />
            )}
          </Card>
        </div>

        {/* Get Started Button */}
        <Button
          variant="solid"
          size="large"
          fullWidth
          onClick={handleFinish}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
