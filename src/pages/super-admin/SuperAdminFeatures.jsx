import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageState from '../../components/ui/AdminPageState';
import {
  deleteFeature,
  fetchFeatures,
  fetchPlans,
  updateFeature,
} from '../../services/super-admin/adminService';
import { mapFeatureRow } from '../../utils/adminMappers';
import FeaturesTable from './components/FeaturesTable';
import FeatureDetailsDrawer from './components/FeatureDetailsDrawer';

function AdminFeatures() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionError, setActionError] = useState(null);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [featuresResponse, plansResponse] = await Promise.all([
        fetchFeatures(),
        fetchPlans(),
      ]);

      const rawFeatures = Array.isArray(featuresResponse) ? featuresResponse : [];
      const plans = Array.isArray(plansResponse) ? plansResponse : [];

      setFeatures(rawFeatures.map((feature) => mapFeatureRow(feature, plans)));
    } catch (err) {
      setError(err.message || 'Failed to load features');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRowClick = (feature) => {
    setSelectedFeature(feature);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSaveFeature = async (updatedData) => {
    setActionError(null);
    try {
      await updateFeature(updatedData.id, {
        name: updatedData.name,
        description: updatedData.description,
        enabled: updatedData.status === 'Active',
      });
      await loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to update feature');
    }
  };

  const handleDeleteFeature = async (featureId) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    setActionError(null);
    try {
      await deleteFeature(featureId);
      setDrawerOpen(false);
      await loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete feature');
    }
  };

  return (
    <>
      <AdminPageState loading={loading} error={error} onRetry={loadData}>
        <div className="p-8 space-y-8">
          {/* Top Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold font-outfit text-[#0b1c30]">Feature Modules</h1>
              <p className="text-sm text-[#414753] mt-1">
                Manage global AI capabilities available across merchant subscription plans.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/features/create')}
              className="admin-cta-btn rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Create Feature
            </button>
          </div>

          {/* Action Error Banner */}
          {actionError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {actionError}
            </div>
          )}

          {/* Features Table Container */}
          <FeaturesTable features={features} onRowClick={handleRowClick} />
        </div>
      </AdminPageState>

      {/* Edit / Details Drawer */}
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