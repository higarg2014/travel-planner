import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, Container } from '@mui/material';
import TripInputForm from './components/TripInputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import type { Itinerary } from './types/itinerary';

const theme = createTheme();

function App() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 4, fontWeight: 'bold' }}
          >
            AI Trip Planner
          </Typography>
          {!itinerary ? (
            <TripInputForm onItineraryGenerated={setItinerary} />
          ) : (
            <ItineraryDisplay itinerary={itinerary} onReset={() => setItinerary(null)} />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
