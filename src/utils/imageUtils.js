export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If path is already a full URL
  if (path.startsWith('http')) {
    return path;
  }

  // Remove leading slash if exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.VITE_IMG_URL}${cleanPath}`;
};

export const getFallbackUrl = (path) => {
  if (!path) return null;
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.VITE_FALLBACK_URL}${cleanPath}`;
}; 