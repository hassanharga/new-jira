export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const parseToHtml = (val: string) => {
  return new DOMParser().parseFromString(val, 'text/html').documentElement.textContent || '';
};
