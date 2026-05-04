import { Box, Typography } from '@mui/material';

const TestComponent = () => {
  console.log('TestComponent rendering');
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Test Component</Typography>
      <Typography>If you can see this, routing is working!</Typography>
    </Box>
  );
};

export default TestComponent; 