const textFrom = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textFrom).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return textFrom(value.detail) || textFrom(value.message) || textFrom(value.title) || textFrom(value.errors);
  }
  return String(value);
};

export const getServerErrorText = (error) => textFrom(error?.rawResponseData || error?.response?.data || error?.message).trim();

export const getUserErrorMessage = (error, fallback = 'We could not complete that request. Please try again.', context = '') => {
  const status = error?.response?.status || error?.status;
  const raw = getServerErrorText(error);
  const message = raw.toLowerCase();

  if (!navigator.onLine || message.includes('network error') || message.includes('failed to fetch')) return 'You appear to be offline. Check your internet connection and try again.';
  if (context === 'password-reset' && /(invalid|expired).*(token|link)|token.*(invalid|expired)/.test(message)) return 'This password-reset link is invalid or has expired. Please request a new link.';
  if (context === 'login' && /(invalid credential|invalid email|invalid password|incorrect password|login failed)/.test(message)) return 'The email address or password is incorrect.';
  if (context === 'registration' && /(already exists|already registered|duplicate|email.*exist)/.test(message)) return 'An account with this email address already exists. Try signing in instead.';
  if (/(no|without).*(active|current).*(plan|subscription)|(plan|subscription).*(not|isn.t).*(active|found)/.test(message)) return 'You do not have an active plan yet. Choose a plan to continue.';
  if (/(shop|store).*(domain).*(already|exist|used)|domain.*(already|exist|used)/.test(message)) return 'This website domain is already connected to a store. Use a different domain, or update the existing store.';
  if (/no (store|organization) associated|organization.*not found|store.*not found|store session is incomplete/.test(message)) return 'Your store session is being prepared. Please sign in again, then try once more.';
  if (/duplicate.*(upload|document|file)|already uploaded/.test(message)) return 'This file has already been uploaded to your store.';
  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to do this action.';
  if (status === 404) return 'We could not find the item you requested.';
  if (status === 409) return 'This action conflicts with existing data. Refresh the page and try again.';
  if (status === 422 || /validation(exception| error)|field required|input should be|not a valid/.test(message)) return 'Please check the information you entered and try again.';
  if (status === 429) return 'You have made too many requests. Please wait a moment and try again.';
  if (status >= 500 || /internal server|database|exception|traceback|stack trace/.test(message)) return 'Something went wrong on our side. Please try again in a moment.';

  // Keep messages that are already short and written for an end user.
  if (raw && raw.length <= 180 && !/[{}[\]]/.test(raw)) return raw;
  return fallback;
};

export const prepareUserError = (error, fallback, context) => {
  error.userMessage = getUserErrorMessage(error, fallback, context);
  return error;
};
