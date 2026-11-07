import { useState } from 'react';
import { useSession } from '../context/SessionContext';
import { usePageSurface } from '../hooks/useSurface';
import { PageHeader, SegmentedControl } from '../components';
import MultiDeviceHost from './MultiDeviceHost';
import MultiDeviceJoin from './MultiDeviceJoin';

const TABS = [
  { id: 'host', label: 'Host' },
  { id: 'join', label: 'Join' },
];

export default function MultiDeviceLobby({ onBack, onGameStart, colorIndex, initialCode = '' }) {
  const { style } = usePageSurface(colorIndex);
  const [activeTab, setActiveTab] = useState(initialCode ? 'join' : 'host');

  const { sessionCode } = useSession();
  const hasActiveSession = !!sessionCode;

  return (
    <div className="min-h-dvh p-8 text-fg transition-colors duration-500" style={style}>
      {!hasActiveSession && (
        <div className="max-w-2xl mx-auto mb-8">
          <PageHeader
            title="JOIN GAME"
            description="Host a new game or join an existing one"
            onBack={onBack}
          />
          <SegmentedControl
            options={TABS}
            value={activeTab}
            onChange={setActiveTab}
            ariaLabel="Multi-device game options"
          />
        </div>
      )}

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
