import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, PageHeader } from '../components';
import SettingToggle from '../components/SettingToggle';
import ColorSchemeCard from '../components/ColorSchemeCard';
import { getColorByScheme } from '../utils/colors';
import { usePageSurface } from '../hooks/useSurface';
import { useSettings } from '../context/SettingsContext';
import { COLOR_SCHEMES } from '../utils/defaultSettings';

// Shorter labels so the compact 2x2 cards stay on one line
const SCHEME_LABELS = { ...COLOR_SCHEMES, default: 'CMYK' };

export default function Onboarding({ onComplete, colorIndex }) {
  const { settings, updateSetting } = useSettings();
  const [localColorScheme, setLocalColorScheme] = useState(settings.visual.colorScheme);
  const { style: surfaceStyle } = usePageSurface(getColorByScheme(colorIndex, localColorScheme));

  const handleColorSchemeChange = (scheme) => {
    setLocalColorScheme(scheme);
    updateSetting('visual', 'colorScheme', scheme);
  };

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div
      className="min-h-dvh flex flex-col text-fg transition-colors duration-500"
      style={surfaceStyle}
    >
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-8 md:px-8">
        <PageHeader
          title="WELCOME"
          description="Pick a colour scheme. You can change it any time in Settings."
          className="mb-6"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.keys(COLOR_SCHEMES).map((scheme) => (
            <ColorSchemeCard
              key={scheme}
              scheme={scheme}
              label={SCHEME_LABELS[scheme]}
              isSelected={localColorScheme === scheme}
              onClick={() => handleColorSchemeChange(scheme)}
              compact
            />
          ))}
        </div>

        <div className="mt-4 border-t-2 border-fg/20">
          <SettingToggle
            label="Dark Mode"
            description="Use darker colours for backgrounds"
            enabled={settings.visual.enableDarkMode}
            onChange={(value) => updateSetting('visual', 'enableDarkMode', value)}
          />
        </div>
      </main>

      {/* Pinned so the single call to action is always visible */}
      <div className="sticky bottom-0 bg-surface transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
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
    </div>
  );
}

Onboarding.propTypes = {
  onComplete: PropTypes.func.isRequired,
  colorIndex: PropTypes.number.isRequired,
};
