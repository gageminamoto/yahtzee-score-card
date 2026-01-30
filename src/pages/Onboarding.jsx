import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from '../components';
import SettingToggle from '../components/SettingToggle';
import ColorSchemeCard from '../components/ColorSchemeCard';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { COLOR_SCHEMES } from '../utils/defaultSettings';

export default function Onboarding({ onComplete, colorIndex }) {
  const { settings, updateSetting } = useSettings();
  const [localColorScheme, setLocalColorScheme] = useState(settings.visual.colorScheme);
  const backgroundColor = getColorByScheme(colorIndex, localColorScheme);
  const textColor = getTextColorForBackground(backgroundColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  const handleColorSchemeChange = (scheme) => {
    setLocalColorScheme(scheme);
    updateSetting('visual', 'colorScheme', scheme);
  };

  const handleComplete = () => {
    updateSetting('preferences', 'showTutorial', false);
    onComplete();
  };

  const handleSkip = () => {
    updateSetting('preferences', 'showTutorial', false);
    onComplete();
  };

  return (
    <div
      className="min-h-dvh p-4 md:p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with Skip */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSkip}
            className="font-sans text-body hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            Skip
          </button>
        </div>

        {/* Welcome Title */}
        <div className="text-center mb-12">
          <h1
            className="font-serif text-title md:text-headline mb-4 text-balance"
            style={{ color: textColor }}
          >
            WELCOME
          </h1>
          <p
            className="font-sans text-body-lg opacity-90 text-pretty"
            style={{ color: textColor }}
          >
            Let&apos;s set up a few things before you start.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6 mb-12">
          <Card padding="medium">
            <h2 className="font-serif text-subtitle text-white dark:text-black mb-4 text-balance">
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
            <h2 className="font-serif text-subtitle text-white dark:text-black mb-4 text-balance">
              SOUND & FEEDBACK
            </h2>
            <SettingToggle
              label="Sound Effects"
              description="Play audio feedback such as the winner fanfare"
              enabled={settings.accessibility.enableSoundEffects}
              onChange={(value) => updateSetting('accessibility', 'enableSoundEffects', value)}
            />
            <SettingToggle
              label="Haptic Feedback"
              description="Vibrate on interactions (mobile devices)"
              enabled={settings.accessibility.enableHapticFeedback}
              onChange={(value) => updateSetting('accessibility', 'enableHapticFeedback', value)}
            />
          </Card>
        </div>

        {/* Get Started Button */}
        <Button
          variant="solid"
          size="large"
          fullWidth
          onClick={handleComplete}
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
