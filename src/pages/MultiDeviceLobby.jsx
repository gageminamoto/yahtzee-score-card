import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { getColorByScheme, getTextColorForBackground } from '../utils/colors';
import { useSettings } from '../context/SettingsContext';
import { useSession } from '../context/SessionContext';
import MultiDeviceHost from './MultiDeviceHost';
import MultiDeviceJoin from './MultiDeviceJoin';

export default function MultiDeviceLobby({ onBack, onGameStart, colorIndex, initialCode = '' }) {
  const { settings } = useSettings();
  const colorScheme = settings.visual.colorScheme;
  const backgroundColor = getColorByScheme(colorIndex, colorScheme);
  const textColor = getTextColorForBackground(backgroundColor);
  const [activeTab, setActiveTab] = useState(initialCode ? 'join' : 'host');

  const { sessionCode } = useSession();
  const hasActiveSession = !!sessionCode;

  // Sync background color to html/body for overscroll
  useEffect(() => {
    document.documentElement.style.setProperty('--page-bg', backgroundColor);
  }, [backgroundColor]);

  return (
    <div
      className="min-h-dvh p-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      {!hasActiveSession && (
        <div className="max-w-2xl mx-auto mb-8">
          <button
            onClick={onBack}
            className="font-sans text-body mb-8 hover:opacity-70 transition-opacity flex items-center gap-2"
            style={{ color: textColor }}
          >
            <Icon icon="basil:arrow-left-solid" className="w-6 h-6" />
            Back
          </button>

          <h1
            className="font-serif text-title md:text-headline mb-4 text-balance"
            style={{ color: textColor }}
          >
            JOIN GAME
          </h1>
          <p
            className="font-sans text-body opacity-90 mb-8 text-pretty"
            style={{ color: textColor }}
          >
            Host a new game or join an existing one
          </p>

          {/* Tab Bar */}
          <div
            className="flex rounded-lg overflow-hidden"
            role="tablist"
            aria-label="Multi-device game options"
            style={{
              backgroundColor: textColor === '#000000'
                ? 'rgba(0, 0, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setActiveTab('host')}
              role="tab"
              aria-selected={activeTab === 'host'}
              className="flex-1 py-3.5 font-sans font-bold uppercase text-body tracking-wider transition-all duration-200"
              style={{
                color: textColor,
                backgroundColor: activeTab === 'host'
                  ? (textColor === '#000000' ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.22)')
                  : 'transparent',
                opacity: activeTab === 'host' ? 1 : 0.5,
              }}
            >
              Host
            </button>
            <button
              onClick={() => setActiveTab('join')}
              role="tab"
              aria-selected={activeTab === 'join'}
              className="flex-1 py-3.5 font-sans font-bold uppercase text-body tracking-wider transition-all duration-200"
              style={{
                color: textColor,
                backgroundColor: activeTab === 'join'
                  ? (textColor === '#000000' ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.22)')
                  : 'transparent',
                opacity: activeTab === 'join' ? 1 : 0.5,
              }}
            >
              Join
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'host' ? (
        <MultiDeviceHost
          embedded
          onBack={onBack}
          onGameStart={onGameStart}
          colorIndex={colorIndex}
        />
      ) : (
        <MultiDeviceJoin
          embedded
          onBack={onBack}
          onGameStart={onGameStart}
          colorIndex={colorIndex}
          initialCode={initialCode}
        />
      )}
    </div>
  );
}
