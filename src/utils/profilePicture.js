import { profileApi } from '../api/profileApi';

const BACKEND_URL = import.meta.env.VITE_MAIN_API_URL || 'https://aisales123.runasp.net';

export const resolveProfilePicture = (value) => {
  if (!value) return '';
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  return `${BACKEND_URL}${value.startsWith('/') ? value : `/${value}`}`;
};

export const saveMerchantProfile = (updates = {}) => {
  let current = {};
  try { current = JSON.parse(localStorage.getItem('merchantProfile') || '{}'); } catch { /* ignore invalid saved data */ }
  const profile = { ...current, ...updates };
  localStorage.setItem('merchantProfile', JSON.stringify(profile));
  window.dispatchEvent(new Event('merchant-profile-updated'));
  return profile;
};

export const fetchAndUpdateProfile = async () => {
  if (!localStorage.getItem('token')) return null;
  try {
    const { data } = await profileApi.get();
    if (!data) return null;
    return saveMerchantProfile({
      firstName: data.firstName || data.first_name || '',
      lastName: data.lastName || data.last_name || '',
      email: data.email || '',
      profilePictureUrl: data.profilePictureUrl || data.profile_picture_url || '',
    });
  } catch {
    return null;
  }
};
