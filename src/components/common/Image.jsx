import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { colors } from '@/theme';

const Image = React.memo(({ 
  src, 
  alt = '', 
  sx = {}, 
  fallbackComponent,
  ...props 
}) => {

  const awsUrl = src ? `https://alif-kids-pdfs.s3.eu-north-1.amazonaws.com/uploads/${src}` : null;
  const fallbackUrl = src ? `https://media.kidsread.app/${src}` : null;

  const [imageUrl, setImageUrl] = useState(awsUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // 1) If AWS fails → try fallback
    if (imageUrl === awsUrl && fallbackUrl) {
      setImageUrl(fallbackUrl);
      return;
    }

    // 2) All failed → show default fallback
    setHasError(true);
  };

  const DefaultFallback = (
    <Box
      sx={{
        bgcolor: colors.lightPurple,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        ...sx
      }}
    >
      {alt?.charAt(0)?.toUpperCase() || '?'}
    </Box>
  );

  useEffect(() => {
    setImageUrl(awsUrl);
  }, [src]);

  if (hasError) {
    return fallbackComponent || DefaultFallback;
  }

  return (
    <Box
      component="img"
      src={imageUrl}
      alt={alt}
      onError={handleError}
      sx={{
        objectFit: 'cover',
        width: '100%',
        height: '100%',
        ...sx
      }}
      {...props}
    />
  );
});

Image.displayName = 'Image';

export default Image;




// import React, { useState, useMemo, useEffect } from 'react';
// import { Box } from '@mui/material';
// import { colors } from '@/theme';
// import { IMG_URL, FALLBACK_URL, getImageUrl, getFallbackUrl } from '@/config/env';

// const Image = React.memo(({ 
//   src, 
//   alt = '', 
//   sx = {}, 
//   fallbackComponent,
//   ...props 
// }) => {
//   const [imageUrl, setImageUrl] = useState(getImageUrl(src));
//   const [hasError, setHasError] = useState(false);

//   const handleError = () => {
//     const fallback = getFallbackUrl(src);
//     if (imageUrl !== fallback) {
//       setImageUrl(fallback);
//     } else {
//       setHasError(true);
//     }
//   };

//   // Default fallback component
//   const DefaultFallback = (
//     <Box
//       sx={{
//         bgcolor: colors.lightPurple,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         width: '100%',
//         height: '100%',
//         borderRadius: 'inherit',
//         ...sx
//       }}
//     >
//       {alt?.charAt(0)?.toUpperCase() || '?'}
//     </Box>
//   );
// useEffect(()=>{
// setImageUrl(getImageUrl(src))
// },[src])
//   if (hasError) {
//     return fallbackComponent || DefaultFallback;
//   }

//   return (
//     <Box
//       component="img"
//       src={imageUrl}
//       alt={alt}
//       onError={handleError}
//       sx={{
//         objectFit: 'cover',
//         width: '100%',
//         height: '100%',
//         ...sx
//       }}
//       {...props}
//     />
//   );
// });

// Image.displayName = 'Image';

// export default Image; 