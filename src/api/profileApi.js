import { api } from './axiosConfig';

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: ({ firstName, lastName, phoneNumber }) => api.put('/api/profile', { firstName, lastName, phoneNumber: phoneNumber || null }),
  uploadPicture: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/profile/picture', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  changePassword: ({ currentPassword, newPassword, confirmPassword }) =>
    api.post('/api/profile/change-password', { currentPassword, newPassword, confirmPassword }),
};
