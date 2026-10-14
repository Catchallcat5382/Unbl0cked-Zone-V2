window.UZ_NORMALIZE_API_URL = function(value) {
  var url = String(value || '').trim().replace(/\/+$/, '');
  return url;
};
try {
  localStorage.removeItem('uzMongoApiUrl');
  localStorage.removeItem('uzMongoToken');
  sessionStorage.removeItem('uzMongoToken');
  sessionStorage.removeItem('uzSessionOk');
} catch(e) {}
window.UZ_COMMUNITY_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  authProvider: 'firebase',
  firebaseConfig: {
    apiKey: 'AIzaSyD-ntSJGAP7hihz3_whKq0FCCR5HWsMiOo',
    authDomain: 'unbl0ck3d-z0ne.firebaseapp.com',
    projectId: 'unbl0ck3d-z0ne',
    appId: '1:376137833575:web:97e31ef3411864551ac8c2'
  },
  mongoApiUrl: '',
  internalAuthDomain: 'uzlogin.net',
  ownerUsernames: '',
  ownerBypassHash: '7e72ea0dcee964fa6f5220219cad4ceaf6e4e8caf27d29fb788dbb6d1eabc90f',
  requireLogin: true,
  minNameLength: 2,
  maxNameLength: 24,
  blockedWords: ['fuck','shit','bitch','asshole','nigger','nigga','faggot','retard','cunt','kike','spic','chink','coon','whore','slut','rape','porn','sex']
};
window.UZ_ACCOUNT_DEBUG = window.UZ_ACCOUNT_DEBUG || [];
window.UZ_ACCOUNT_DEBUG.push('config-loaded:firebase');
