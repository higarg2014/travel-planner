import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import HomePage from './components/HomePage';
import LoadingScreen from './components/LoadingScreen';
import ItineraryDisplay from './components/ItineraryDisplay';
import type { Itinerary } from './types/itinerary';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
  },
});

function App() {
  const [view, setView] = useState<'home' | 'loading' | 'itinerary'>('home');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleItineraryGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setView('itinerary');
    setIsLoading(false);
  };

  const handleStartLoading = () => {
    setIsLoading(true);
  };

  const handleReset = () => {
    setItinerary(null);
    setView('home');
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', margin: 0, padding: 0, width: '100%' }}>
        <Box sx={{ display: view === 'home' ? 'block' : 'none' }}>
          <HomePage
            onItineraryGenerated={handleItineraryGenerated}
            onStartLoading={handleStartLoading}
          />
        </Box>

        {isLoading && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            <LoadingScreen />
          </Box>
        )}

        {view === 'itinerary' && itinerary && (
          <Box sx={{ py: 4 }}>
            <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
