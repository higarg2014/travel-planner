import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  CircularProgress,
  Paper,
  InputAdornment,
  Stack,
  Alert,
} from '@mui/material';
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
    preferences: {
      activities: '',
      hotelType: '',
      foodPreferences: '',
    },
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
      console.error('Error generating itinerary:', err);
      setError('Failed to generate itinerary. Please check your Google API key and try again.');
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.destination.trim() !== '' &&
      formData.checkIn !== null &&
      formData.checkOut !== null &&
      formData.travelers >= 1 &&
      formData.budget > 0
    );
  };

  const minCheckOutDate = formData.checkIn
    ? dayjs(formData.checkIn).add(1, 'day')
    : dayjs().add(1, 'day');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
            Plan Your Trip
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Destination */}
              <TextField
                fullWidth
                label="Destination"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />

              {/* Check-in and Check-out Dates */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <DatePicker
                  label="Check-in Date"
                  value={formData.checkIn ? dayjs(formData.checkIn) : null}
                  onChange={(newValue: Dayjs | null) =>
                    setFormData({ ...formData, checkIn: newValue ? newValue.toDate() : null })
                  }
                  minDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />

                <DatePicker
                  label="Check-out Date"
                  value={formData.checkOut ? dayjs(formData.checkOut) : null}
                  onChange={(newValue: Dayjs | null) =>
                    setFormData({ ...formData, checkOut: newValue ? newValue.toDate() : null })
                  }
                  minDate={minCheckOutDate}
                  disabled={!formData.checkIn}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Box>

              {/* Number of Travelers and Budget */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Travelers"
                  value={formData.travelers}
                  onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                  }}
                  required
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Total Budget"
                  value={formData.budget || ''}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                  }}
                  required
                />
              </Box>

              {/* Preferences Section */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Preferences (Optional)
              </Typography>

              <TextField
                fullWidth
                label="Activities"
                placeholder="e.g., museums, hiking, beaches"
                value={formData.preferences.activities}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, activities: e.target.value }
                })}
                multiline
                rows={2}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Hotel Type"
                  placeholder="e.g., boutique, luxury, budget"
                  value={formData.preferences.hotelType}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, hotelType: e.target.value }
                  })}
                />

                <TextField
                  fullWidth
                  label="Food Preferences"
                  placeholder="e.g., vegetarian, local cuisine"
                  value={formData.preferences.foodPreferences}
                  onChange={(e) => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, foodPreferences: e.target.value }
                  })}
                />
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={!isFormValid() || loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Itinerary'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
