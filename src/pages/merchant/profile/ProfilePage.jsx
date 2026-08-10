import { useEffect, useState } from 'react';
import { Camera, KeyRound, Loader2, Save, Store, UserCircle } from 'lucide-react';
import { profileApi } from '../../../api/profileApi';
import { resolveProfilePicture, saveMerchantProfile } from '../../../utils/profilePicture';
import { getUserErrorMessage } from '../../../utils/errorMessage';

const errorMessage = (error, fallback) => getUserErrorMessage(error, fallback);

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    profileApi.get().then(({ data }) => {
      if (!active) return;
      setProfile(data);
      setForm({ firstName: data.firstName || '', lastName: data.lastName || '', phoneNumber: data.phoneNumber || '' });
      saveMerchantProfile({ firstName: data.firstName || '', lastName: data.lastName || '', email: data.email || '', profilePictureUrl: data.profilePictureUrl || '' });
    }).catch((requestError) => active && setError(errorMessage(requestError, 'Could not load your profile.'))).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const setField = (setter) => (event) => setter((current) => ({ ...current, [event.target.name]: event.target.value }));
  const saveProfile = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setMessage('');
    try {
      const { data } = await profileApi.update(form);
      const updated = data.profile || data.data || data;
      setProfile(updated);
      saveMerchantProfile({ firstName: updated.firstName || form.firstName, lastName: updated.lastName || form.lastName, email: updated.email || profile?.email || '', profilePictureUrl: updated.profilePictureUrl || profile?.profilePictureUrl || '' });
      setMessage(data.message || 'Profile updated successfully.');
    } catch (requestError) { setError(errorMessage(requestError, 'Could not update your profile.')); }
    finally { setSaving(false); }
  };
  const uploadPicture = async (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true); setError(''); setMessage('');
    try {
      const { data } = await profileApi.uploadPicture(file);
      const profilePictureUrl = data.profilePictureUrl || data.url || data.data?.profilePictureUrl;
      if (!profilePictureUrl) throw new Error('The uploaded image URL was not returned.');
      setProfile((current) => ({ ...current, profilePictureUrl }));
      saveMerchantProfile({ profilePictureUrl });
      setMessage(data.message || 'Profile picture updated successfully.');
    } catch (requestError) { setError(errorMessage(requestError, 'Could not upload this profile picture.')); }
    finally { setUploading(false); event.target.value = ''; }
  };
  const submitPassword = async (event) => {
    event.preventDefault(); setChangingPassword(true); setError(''); setMessage('');
    try { const { data } = await profileApi.changePassword(password); setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' }); setMessage(data.message || 'Password changed successfully.'); }
    catch (requestError) { setError(errorMessage(requestError, 'Could not change your password.')); }
    finally { setChangingPassword(false); }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-slate-500"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading profile…</div>;
  const stores = Array.isArray(profile?.stores) ? profile.stores : [];
  const subscription = profile?.subscription;
  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() || 'M';
  const picture = resolveProfilePicture(profile?.profilePictureUrl);

  return <div className="mx-auto max-w-5xl space-y-6 p-6">
    <div><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Profile</h1><p className="mt-1 text-sm text-slate-500">Manage your account, stores, and security.</p></div>
    {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    {message && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <div className="grid gap-6 lg:grid-cols-[1fr_1.45fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-4"><div className="relative"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-2xl font-bold text-white">{picture ? <img src={picture} alt="Profile" className="h-full w-full object-cover" /> : initials}</div><label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white"><Camera className="h-4 w-4" /><input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={uploadPicture} /></label></div><div><h2 className="font-bold text-slate-900">{profile?.firstName} {profile?.lastName}</h2><p className="text-sm text-slate-500">{profile?.email}</p>{uploading && <p className="mt-1 text-xs text-indigo-600">Uploading picture…</p>}</div></div><div className="mt-6 border-t border-slate-100 pt-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Subscription</p>{subscription ? <><p className="mt-2 font-semibold text-slate-900">{subscription.planName || 'Current plan'}</p><p className="text-sm text-slate-500">{subscription.status} · ${subscription.planPrice ?? 0}/mo</p></> : <p className="mt-2 text-sm text-slate-500">No subscription information available.</p>}</div></section>
      <form onSubmit={saveProfile} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-900"><UserCircle className="h-5 w-5 text-indigo-600" />Personal details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="First name" name="firstName" value={form.firstName} onChange={setField(setForm)} /><Field label="Last name" name="lastName" value={form.lastName} onChange={setField(setForm)} /><Field label="Phone number" name="phoneNumber" value={form.phoneNumber} onChange={setField(setForm)} required={false} /></div><button disabled={saving} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save profile'}</button></form>
    </div>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-900"><Store className="h-5 w-5 text-indigo-600" />Your stores</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{stores.length ? stores.map((store) => <div key={store.storeId} className="rounded-xl border border-slate-100 p-4"><p className="font-semibold text-slate-900">{store.name}</p><p className="mt-1 text-sm text-slate-500">{store.platform || 'Custom'} · {store.status || 'Active'}</p><p className="mt-2 truncate text-xs text-slate-400">{store.shopDomain || store.description || 'No domain provided'}</p></div>) : <p className="text-sm text-slate-500">No stores found for this account.</p>}</div></section>
    <form onSubmit={submitPassword} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 font-bold text-slate-900"><KeyRound className="h-5 w-5 text-indigo-600" />Change password</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><Field label="Current password" name="currentPassword" type="password" value={password.currentPassword} onChange={setField(setPassword)} /><Field label="New password" name="newPassword" type="password" value={password.newPassword} onChange={setField(setPassword)} /><Field label="Confirm new password" name="confirmPassword" type="password" value={password.confirmPassword} onChange={setField(setPassword)} /></div><button disabled={changingPassword} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 disabled:opacity-60">{changingPassword ? 'Updating…' : 'Change password'}</button></form>
  </div>;
}

function Field({ label, name, type = 'text', value, onChange, required = true }) { return <label className="block text-sm font-medium text-slate-700">{label}<input required={required} name={name} type={type} value={value} onChange={onChange} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" /></label>; }
