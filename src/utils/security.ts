import CryptoJS from 'crypto-js';

// Generate unique session token
export const generateSessionToken = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return CryptoJS.SHA256(`${timestamp}-${random}`).toString();
};

// Encrypt sensitive content
export const encryptContent = (content: string, key: string) => {
  return CryptoJS.AES.encrypt(content, key).toString();
};

// Decrypt content
export const decryptContent = (encrypted: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Generate user fingerprint
export const generateFingerprint = () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ];
  return CryptoJS.SHA256(components.join('|')).toString();
};

// Rate limiting implementation
const rateLimits = new Map<string, number[]>();

export const checkRateLimit = (userId: string, limit: number, timeWindow: number) => {
  const now = Date.now();
  const userRequests = rateLimits.get(userId) || [];
  
  // Remove old requests outside the time window
  const validRequests = userRequests.filter(time => now - time < timeWindow);
  
  if (validRequests.length >= limit) {
    return false;
  }
  
  validRequests.push(now);
  rateLimits.set(userId, validRequests);
  return true;
};