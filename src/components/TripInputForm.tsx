import { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CircularProgress, Paper, Stack, Alert } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TripInput } from '../types/trip';
import { generateItinerary } from '../services/api';
import type { Itinerary } from '../types/itinerary';

interface Props {
  onItineraryGenerated: (itinerary: Itinerary) => void;
}

export default function TripInputForm({ onItineraryGenerated }: Props) {
  const [formData, setFormData] = useState<TripInput>({
    destination: '',
    checkIn: null,
    checkOut: null,
    travelers: 1,
    budget: 0,
    preferences: { activities: '', hotelType: '', foodPreferences: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const itinerary = await generateItinerary(formData);
      onItineraryGenerated(itinerary);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      setLoading(false);
    }
  };

  const isFormValid = () => formData.destination.trim() !== '' && formData.checkIn && formData.checkOut && formData.travelers >= 1 && formData.budget > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', color: 'white', mb: 5 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Plan Your Dream Trip</Typography>
            <Typography variant="h5">Let AI create the perfect itinerary for you</Typography>
          </Box>
          <Paper elevation={10} sx={{ p: 4, borderRadius: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField fullWidth label="Destination" placeholder="e.g., Paris, France" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}, required: true }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <DatePicker label="Check-in" value={formData.checkIn ? dayjs(formData.checkIn) : null} onChange={(v: Dayjs | null) => setFormData({ ...formData, checkIn: v?.toDate() || null })} minDate={dayjs()} slotProps={{ textField: { fullWidth: true, required: true } }} />
                  <DatePicker label="Check-out" value={formData.checkOut ? dayjs(formData.checkOut) : null} onChange={(v: Dayjs | null) => setFormData({ ...formData, checkOut: v?.toDate() || null })} minDate={formData.checkIn ? dayjs(formData.checkIn).add(1, 'day') : dayjs()} disabled={!formData.checkIn} slotProps={{ textField: { fullWidth: true, required: true } }} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField fullWidth type="number" label="Travelers" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })} slotProps={{ input: { inputProps: { min: 1 } }}, required: true }} />
                  <TextField fullWidth type="number" label="Budget ($)" value={formData.budget || ''} onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })} slotProps={{ input: { inputProps: { min: 0 } }}, required: true }} />
                </Stack>
                <TextField fullWidth label="Preferences (Optional)" placeholder="e.g., museums, beaches, local food" multiline rows={2} value={formData.preferences.activities} onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, activities: e.target.value } })} />
                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                <Button type="submit" variant="contained" size="large" fullWidth disabled={!isFormValid() || loading} sx={{ py: 2, fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', '&:hover': { background: 'linear-gradient(45deg, #5568d3 30%, #654a8f 90%)' }, '&:disabled': { background: '#ccc' } }}>
                  {loading ? <><CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> Creating...</> : <><AutoAwesome sx={{ mr: 1 }} /> Generate Itinerary</>}
                </Button>
                <Typography variant="body2" color="text.secondary" align="center">Powered by Google Gemini AI</Typography>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
