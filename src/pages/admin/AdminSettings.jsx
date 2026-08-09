import { useCallback, useEffect, useRef, useState } from 'react';
import AdminPageState from '../../components/ui/AdminPageState';
import {
  changePassword,
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from '../../services/adminService';
import { API_BASE_URL } from '../../services/admin/apiClient';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value ?? 0);
}

function extractErrorMessage(err) {
  const raw = err?.message ?? 'An error occurred';
  try {
    const parsed = JSON.parse(raw);
    return parsed?.message ?? parsed?.title ?? raw;
  } catch {
    return raw;
  }
}

/**
 * Resolves a profile picture URL returned by the backend.
 * Handles: relative paths, absolute URLs, null/undefined/empty.
 */
function resolveProfilePicture(url) {
  if (!url) return null;
  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path — prepend API base
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBanner({ type, message, onDismiss }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        isError
          ? 'border border-error/20 bg-error-container/10 text-error'
          : 'border border-secondary/20 bg-secondary/5 text-secondary'
      }`}
    >
      <span className="material-symbols-outlined text-lg">
        {isError ? 'error' : 'check_circle'}
      </span>
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onDismiss} className="opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children }) {
  return (
    <div className="admin-glass-card rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-lowest/60 flex items-center gap-3">
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <div>
          <h2 className="font-outfit text-base font-semibold text-on-surface">{title}</h2>
          {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <p className="text-sm text-on-surface font-medium px-1">{value || '—'}</p>
    </div>
  );
}

function InputField({ label, id, type = 'text', value, onChange, placeholder, readOnly, autoComplete }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        autoComplete={autoComplete}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
          readOnly
            ? 'border-outline-variant/30 bg-surface-container text-on-surface-variant cursor-not-allowed'
            : 'border-outline-variant bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary text-on-surface'
        }`}
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Profile data from backend
  const [profile, setProfile] = useState(null);

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileBanner, setProfileBanner] = useState({ type: null, message: null });

  // Picture state
  const [picturePreview, setPicturePreview] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [pictureBanner, setPictureBanner] = useState({ type: null, message: null });
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordBanner, setPasswordBanner] = useState({ type: null, message: null });

  // ── Load profile ─────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      setFirstName(data.firstName ?? '');
      setLastName(data.lastName ?? '');
      setPhoneNumber(data.phoneNumber ?? '');
      return data;
    } catch (err) {
      setLoadError(extractErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Reset image error state when profile picture changes or preview is selected
  useEffect(() => {
    setImgError(false);
  }, [profile?.profilePictureUrl, picturePreview]);

  // ── Profile picture selection ─────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPicturePreview(URL.createObjectURL(file));
    setPictureBanner({ type: null, message: null });
  };

  // ── Upload picture ────────────────────────────────────────────────────────────
  const handleUploadPicture = async () => {
    if (!pendingFile) return;
    setUploadingPicture(true);
    setPictureBanner({ type: null, message: null });
    try {
      const uploadResult = await uploadProfilePicture(pendingFile);

      // Reset imgError to false before loading the new image
      setImgError(false);

      // Re-fetch profile to get updated profilePictureUrl
      const freshProfile = await loadProfile();

      setPendingFile(null);
      // Only clear the preview after the fresh profile data is applied
      setPicturePreview(null);
      setPictureBanner({ type: 'success', message: 'Profile picture updated successfully.' });
    } catch (err) {
      setPictureBanner({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setUploadingPicture(false);
    }
  };

  // ── Save profile ──────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setProfileBanner({ type: 'error', message: 'First name and last name are required.' });
      return;
    }
    setSavingProfile(true);
    setProfileBanner({ type: null, message: null });
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim() || null,
      });
      const updated = await getProfile();
      setProfile(updated);
      setProfileBanner({ type: 'success', message: 'Profile updated successfully.' });
    } catch (err) {
      setProfileBanner({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordBanner({ type: null, message: null });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordBanner({ type: 'error', message: 'All password fields are required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordBanner({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }
    // Basic strength check — backend is the authority
    const strongEnough = /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword) && newPassword.length >= 8;
    if (!strongEnough) {
      setPasswordBanner({
        type: 'error',
        message: 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.',
      });
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordBanner({ type: 'success', message: 'Password changed successfully.' });
    } catch (err) {
      setPasswordBanner({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setChangingPassword(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  const displayPicture = picturePreview ?? resolveProfilePicture(profile?.profilePictureUrl);
  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase() || 'SA';

  return (
    <AdminPageState loading={loading} error={loadError} onRetry={loadProfile}>
      <div className="p-8 space-y-8 max-w-4xl mx-auto">

        {/* ── Profile Info & Picture ─────────────────────────────────────────── */}
        <SectionCard
          title="Profile Information"
          subtitle="Update your name, phone number, and profile picture."
          icon="account_circle"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Picture column */}
            <div className="flex flex-col items-center gap-4 min-w-[160px]">
              <div className="w-28 h-28 rounded-full border-2 border-primary/20 overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                {displayPicture && !imgError ? (
                  <img
                    key={displayPicture}
                    src={displayPicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="font-outfit text-2xl font-bold text-primary select-none">{initials}</span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                id="picture-file-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">upload</span>
                Choose Photo
              </button>
              {pendingFile && (
                <button
                  type="button"
                  onClick={handleUploadPicture}
                  disabled={uploadingPicture}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {uploadingPicture ? 'Uploading…' : 'Upload'}
                </button>
              )}
              <StatusBanner
                type={pictureBanner.type}
                message={pictureBanner.message}
                onDismiss={() => setPictureBanner({ type: null, message: null })}
              />
            </div>

            {/* Form column */}
            <form onSubmit={handleSaveProfile} className="flex-1 space-y-5">
              <StatusBanner
                type={profileBanner.type}
                message={profileBanner.message}
                onDismiss={() => setProfileBanner({ type: null, message: null })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  autoComplete="given-name"
                />
                <InputField
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  autoComplete="family-name"
                />
              </div>

              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={profile?.email ?? ''}
                readOnly
                placeholder="Email"
                autoComplete="email"
              />

              <InputField
                id="phoneNumber"
                label="Phone Number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                autoComplete="tel"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60 pointer-events-none">
                <ReadOnlyField label="Last Login" value={formatDate(profile?.lastLogin)} />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all flex items-center gap-2"
                >
                  {savingProfile && (
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </SectionCard>

        {/* ── Change Password ────────────────────────────────────────────────── */}
        <SectionCard
          title="Change Password"
          subtitle="Choose a strong password with at least 8 characters, uppercase, number and special character."
          icon="lock"
        >
          <form onSubmit={handleChangePassword} className="space-y-5">
            <StatusBanner
              type={passwordBanner.type}
              message={passwordBanner.message}
              onDismiss={() => setPasswordBanner({ type: null, message: null })}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="currentPassword"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="newPassword"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <InputField
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2 flex justify-start sm:justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {changingPassword && (
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                )}
                Update Password
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ── Subscription (read-only) ───────────────────────────────────────── */}
        {profile?.subscription && (
          <SectionCard
            title="Subscription"
            subtitle="Your current subscription plan details. Contact support to make changes."
            icon="subscriptions"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <ReadOnlyField label="Plan" value={profile.subscription.planName} />
              <ReadOnlyField label="Status" value={profile.subscription.status} />
              <ReadOnlyField label="Price" value={formatCurrency(profile.subscription.planPrice)} />
              <ReadOnlyField label="Renewal Date" value={formatDate(profile.subscription.renewalDate)} />
            </div>
          </SectionCard>
        )}

        {/* ── Stores (read-only) ─────────────────────────────────────────────── */}
        {Array.isArray(profile?.stores) && profile.stores.length > 0 && (
          <SectionCard
            title="Linked Stores"
            subtitle="Stores associated with your account."
            icon="storefront"
          >
            <div className="space-y-4">
              {profile.stores.map((store, i) => (
                <div
                  key={store.id ?? i}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest/40"
                >
                  <ReadOnlyField label="Store Name" value={store.name} />
                  <ReadOnlyField label="Platform" value={store.platform} />
                  <ReadOnlyField label="Domain" value={store.shopDomain} />
                  <ReadOnlyField label="Currency" value={store.currency} />
                  <ReadOnlyField label="Language" value={store.language} />
                  <ReadOnlyField label="Status" value={store.status} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

      </div>
    </AdminPageState>
  );
}

export default AdminSettings;
