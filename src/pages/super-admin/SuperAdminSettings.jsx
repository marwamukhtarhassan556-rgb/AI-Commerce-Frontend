import { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../../services/adminService';
import AdminPageState from '../../components/ui/AdminPageState';

function SuperAdminSettings() {
  const [settings, setSettings] = useState({
    platformName: '',
    systemEmail: '',
    enablePublicRegistration: true,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSettings();
      setSettings(res);
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateSettings(settings);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPageState loading={loading} error={error} onRetry={loadData}>
      <div className="p-8 max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Global Platform Settings</h1>
          <p className="text-sm text-[#414753] mt-1">Configure global application parameters and maintenance modes.</p>
        </div>

        {success && (
          <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-sm">Settings saved successfully!</div>
        )}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-800 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-[#e0e2ec] shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0b1c30] mb-2">System Support Email</label>
            <input
              type="email"
              value={settings.systemEmail}
              onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
              className="w-full px-4 py-2 border border-[#e0e2ec] rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enablePublicRegistration"
              checked={settings.enablePublicRegistration}
              onChange={(e) => setSettings({ ...settings, enablePublicRegistration: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="enablePublicRegistration" className="text-sm font-medium text-[#0b1c30]">
              Allow public merchant registration
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="maintenanceMode" className="text-sm font-medium text-[#0b1c30]">
              Enable System Maintenance Mode
            </label>
          </div>

          <div className="pt-4 border-t border-[#e0e2ec]">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminPageState>
  );
}

export default SuperAdminSettings;
