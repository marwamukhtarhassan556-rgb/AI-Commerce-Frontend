import { useEffect, useState } from 'react';

function FeatureDetailsDrawer({ feature, open, onClose, onSave, onDelete }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (feature) {
      setName(feature.name ?? '');
      setDescription(feature.description ?? feature.subtitle ?? '');
      setStatus(feature.status ?? 'Active');
    }
  }, [feature]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!feature) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave?.({ ...feature, name: name.trim(), description: description.trim(), status });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-[480px] bg-white shadow-2xl z-[60] transition-transform duration-300 ease-in-out border-l border-outline-variant/30 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Feature Details"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
            <h2 className="font-outfit text-xl font-medium text-on-surface">Feature Details</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 admin-custom-scrollbar">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">Feature Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none cursor-pointer bg-white font-semibold text-on-surface"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface uppercase tracking-wider">Description</label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onDelete?.(feature.id)}
              className="px-4 py-3 border border-error/30 text-error text-sm font-semibold rounded-lg hover:bg-error-container/20 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              Delete
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-outline-variant text-on-surface-variant text-sm font-semibold rounded-lg hover:bg-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeatureDetailsDrawer;
