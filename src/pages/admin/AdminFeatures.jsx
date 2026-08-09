import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import {
  deleteFeature,
  getFeatures,
  getPlans,
  updateFeature,
} from '../../services/adminService';
import { mapFeatureMetrics, mapFeatureRow } from '../../utils/adminMappers';
import FeaturesTable from './components/FeaturesTable';
import FeatureDetailsDrawer from './components/FeatureDetailsDrawer';

function FeatureMetricsHeader({ metrics }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="admin-glass-card p-6 rounded-xl flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${metric.iconBg}`}>
            <span className="material-symbols-outlined text-3xl">{metric.icon}</span>
          </div>
          <div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">
              {metric.label}
            </p>
            <h3 className="font-outfit text-[48px] font-semibold leading-none mt-1">{metric.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminFeatures() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadFeatures = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [featuresResponse, plansResponse] = await Promise.all([getFeatures(), getPlans()]);
    console.log('DEBUG: featuresResponse', featuresResponse);
    console.log('DEBUG: plansResponse', plansResponse);
      const rawFeatures = Array.isArray(featuresResponse) ? featuresResponse : [];
      const plans = Array.isArray(plansResponse) ? plansResponse : [];

      setMetrics(mapFeatureMetrics(rawFeatures));
      setFeatures(rawFeatures.map((feature) => mapFeatureRow(feature, plans)));
    } catch (err) {
      setError(err.message ?? 'Failed to load features');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const handleRowClick = (feature) => {
    setSelectedFeature(feature);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSaveFeature = async (feature) => {
    setActionError(null);

    try {
      await updateFeature(feature.id, {
        name: feature.name,
        description: feature.description,
        enabled: feature.status === 'Active',
      });
      await loadFeatures();
    } catch (err) {
      setActionError(err.message ?? 'Failed to update feature');
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Delete this feature?')) return;

    setActionError(null);

    try {
      await deleteFeature(featureId);
      setDrawerOpen(false);
      await loadFeatures();
    } catch (err) {
      setActionError(err.message ?? 'Failed to delete feature');
    }
  };



  return (
    <>
      <AdminPageState loading={loading} error={error} onRetry={loadFeatures}>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <h1 className="font-outfit text-[32px] font-semibold text-on-surface">Features Management</h1>
              <p className="text-on-surface-variant text-sm mt-1">Manage platform features and plan availability.</p>
            </div>
            <Link
              to="/admin/features/create"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Feature
            </Link>
          </div>

          {actionError && (
            <div className="rounded-xl border border-error/20 bg-error-container/10 px-4 py-3 text-sm text-error">
              {actionError}
            </div>
          )}

          <FeatureMetricsHeader metrics={metrics} />

          <FeaturesTable features={features} onRowClick={handleRowClick} />

          <div className="rounded-xl p-0.5 bg-gradient-to-r from-primary/20 via-secondary-container/20 to-tertiary-fixed/20">
            <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-[calc(0.75rem-2px)] flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h4 className="font-outfit text-xl font-medium text-primary">Feature Summary</h4>
                  <p className="text-sm text-on-surface-variant max-w-xl">
                    {features.length} features loaded from the admin API. Select a row to edit or delete.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminPageState>

      <FeatureDetailsDrawer
        feature={selectedFeature}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveFeature}
        onDelete={handleDeleteFeature}
      />
    </>
  );
}

export default AdminFeatures;
