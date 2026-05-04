// Development URLs
const DEV = {
  // API_URL: "https://kids-read-0200f571e14c.herokuapp.com/api",
  // API_URL: "https://alif-kids-staging-423e69b228fa.herokuapp.com/api",
API_URL:"http://52.56.81.99:5000/api",
  IMG_URL: "https://media.kidsread.app/",
  FALLBACK_URL: "https://kids-read-0200f571e14c.herokuapp.com/public/",
};
  
// Production URLs
const PROD = {  
  API_URL: 'http://52.56.81.99:5000/api',
  IMG_URL: import.meta.env.VITE_IMG_URL,
  FALLBACK_URL: import.meta.env.VITE_FALLBACK_URL
};

// Select environment based on mode
const ENV = import.meta.env.MODE === 'production' ? PROD : DEV;

export const API_URL = ENV.API_URL;
export const IMG_URL = ENV.IMG_URL;
export const FALLBACK_URL = ENV.FALLBACK_URL;

// Helper function to construct full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${IMG_URL}${path.startsWith('/') ? path.slice(1) : path}`;
};

// Helper function to construct fallback URL
export const getFallbackUrl = (path) => {
  if (!path) return null;
  return `${FALLBACK_URL}${path.startsWith('/') ? path.slice(1) : path}`;
};

// Export environment type
export const isDevelopment = import.meta.env.MODE === 'development';
export const isProduction = import.meta.env.MODE === 'production'; 
export const activityTypes = {
  purchase: 'purchase',
  read: 'read',
  edit: 'edit',
  like: 'like',
  withdrawRequest: 'withdrawRequest',
  withdraw: 'withdraw',
  bookMark: 'bookMark',
  review: 'review',
  newBook: 'newBook',
  subscription: 'subscription',
  admin:'admin',
  bookApprove:'bookApprove',
  autoApproval:'autoApproval',
  manualApproval:'manualApproval',
  //auth
  login:'login',
  register:'registration',verification:'verification',accountLocked:'accountLocked',
  approve:'approve',unApprove:'unApprove',
}