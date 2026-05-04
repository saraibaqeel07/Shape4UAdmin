import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import Users from './pages/Users';
import UserDetails from './pages/Users/UserDetails';

const theme = createTheme({
  // Add your theme customization here
});

const App = () => {
  useEffect(() => {
    document.title = 'Shapeup For Life Admin';
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <SnackbarProvider maxSnack={3}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App; 