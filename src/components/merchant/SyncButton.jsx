import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const SyncButton = ({ connectionId }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    if (isSyncing) return;

    setIsSyncing(true);
    window.setTimeout(() => {
      setIsSyncing(false);
      window.alert(`Sync completed successfully for ${connectionId || 'current store'}!`);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={isSyncing}
      aria-busy={isSyncing}
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-label-sm font-label-sm transition-all ${
        isSyncing
          ? 'cursor-not-allowed border-outline-variant bg-surface-container-low text-on-surface-variant'
          : 'border-outline-variant bg-surface-container-high text-primary hover:bg-surface-container-highest'
      }`}
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
    </button>
  );
};

export default SyncButton;
