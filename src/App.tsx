import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import HomePage from './components/HomePage';
import StreamingItinerary from './components/StreamingItinerary';
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
  const [view, setView] = useState<'home' | 'streaming' | 'itinerary'>('home');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [streamedText, setStreamedText] = useState('');

  const handleItineraryGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
    setView('itinerary');
  };

  const handleStartStreaming = () => {
    setView('streaming');
    setStreamedText('');
  };

  const handleStreamProgress = (text: string) => {
    setStreamedText(text);
  };

  const handleReset = () => {
    setItinerary(null);
    setStreamedText('');
    setView('home');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', margin: 0, padding: 0, width: '100%' }}>
        {view === 'home' && (
          <HomePage
            onItineraryGenerated={handleItineraryGenerated}
            onStartStreaming={handleStartStreaming}
            onStreamProgress={handleStreamProgress}
          />
        )}

        {view === 'streaming' && <StreamingItinerary streamedText={streamedText} />}

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
