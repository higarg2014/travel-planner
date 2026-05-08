import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import HomePage from './components/HomePage';
import TripInputForm from './components/TripInputForm';
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
  const [view, setView] = useState<'home' | 'form' | 'itinerary'>('home');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const handleGetStarted = () => {
    setView('form');
  };

  const handleItineraryGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setView('itinerary');
  };

  const handleReset = () => {
    setItinerary(null);
    setView('home');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', margin: 0, padding: 0, width: '100%' }}>
        {view === 'home' && <HomePage onGetStarted={handleGetStarted} />}

        {view === 'form' && (
          <Box sx={{ py: 4 }}>
            <TripInputForm onItineraryGenerated={handleItineraryGenerated} />
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
