import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Chip,
  Stack,
  Paper,
  alpha,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FlightTakeoff,
  LocalOffer,
  TrendingDown,
  ArrowForward,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TripInput } from '../types/trip';
import { generateItinerary } from '../services/api';
import type { Itinerary } from '../types/itinerary';

interface Props {
  onItineraryGenerated: (itinerary: Itinerary) => void;
  onStartLoading: () => void;
}

const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=600&fit=crop',
    tagline: 'City of Lights & Romance',
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=600&fit=crop',
    tagline: 'Modern Meets Traditional',
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop',
    tagline: 'The City That Never Sleeps',
  },
  {
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop',
    tagline: 'Luxury & Innovation',
  },
];

const deals = [
  {
    destination: 'Bali, Indonesia',
    discount: '30% OFF',
    price: '$899',
    originalPrice: '$1,299',
    duration: '7 Days',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
  },
  {
    destination: 'Rome, Italy',
    discount: '25% OFF',
    price: '$1,199',
    originalPrice: '$1,599',
    duration: '5 Days',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
  },
  {
    destination: 'Santorini, Greece',
    discount: '35% OFF',
    price: '$1,499',
    originalPrice: '$2,299',
    duration: '6 Days',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
  },
];

export default function HomePage({ onItineraryGenerated, onStartLoading }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    onStartLoading();

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
      <Box sx={{ minHeight: '100vh' }}>
        {/* Hero Section with Slideshow - Full Viewport */}
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          {destinations.map((dest, index) => (
            <Box
              key={dest.name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${dest.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))',
                },
              }}
            />
          ))}

          {/* Hero Content */}
          <Container
            maxWidth="lg"
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: 'white',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                mb: 2,
              }}
            >
              AI-Powered Trip Planning
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                maxWidth: '700px',
                textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                fontSize: { xs: '1.3rem', md: '2rem' },
                fontWeight: 500,
              }}
            >
              {destinations[currentSlide].tagline}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                maxWidth: '650px',
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.3rem' },
              }}
            >
              Generate complete itineraries in seconds with flights, hotels, activities & restaurants powered by Google Gemini AI
            </Typography>

            {!showForm && (
              <Button
                variant="contained"
                size="large"
                onClick={() => setShowForm(true)}
                endIcon={<ArrowForward />}
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: '1.3rem',
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 4px 20px rgba(33, 203, 243, .4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1CB5DB 90%)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 25px rgba(33, 203, 243, .6)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Plan Your Dream Trip
              </Button>
            )}

            {/* Slide Indicators */}
            <Stack direction="row" spacing={1.5} sx={{ mt: 6 }}>
              {destinations.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  sx={{
                    width: currentSlide === index ? 50 : 15,
                    height: 15,
                    borderRadius: 8,
                    bgcolor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.8)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Container>

          {/* Sticky Search Form Overlay */}
          {showForm && (
            <Box
              sx={{
                position: 'fixed',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                width: { xs: '95%', sm: '90%', md: '800px' },
                maxHeight: 'calc(100vh - 40px)',
                overflowY: 'auto',
              }}
            >
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Destination"
                      placeholder="e.g., Paris, France"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                      size="small"
                    />

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <DatePicker
                        label="Check-in"
                        value={formData.checkIn ? dayjs(formData.checkIn) : null}
                        onChange={(newValue: Dayjs | null) =>
                          setFormData({ ...formData, checkIn: newValue ? newValue.toDate() : null })
                        }
                        minDate={dayjs()}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            size: 'small',
                          },
                        }}
                      />

                      <DatePicker
                        label="Check-out"
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
                            size: 'small',
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Travelers"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                        slotProps={{
                          htmlInput: {
                            min: 1,
                          },
                        }}
                        required
                        size="small"
                      />

                      <TextField
                        fullWidth
                        type="number"
                        label="Budget"
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
                        size="small"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Activities (Optional)"
                      placeholder="e.g., museums, hiking, beaches"
                      value={formData.preferences.activities}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, activities: e.target.value }
                      })}
                      size="small"
                    />

                    {error && (
                      <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => setShowForm(false)}
                        sx={{ flex: 1 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isFormValid() || loading}
                        sx={{
                          flex: 2,
                          py: 1.5,
                          fontWeight: 'bold',
                          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5568d3 30%, #654a8f 90%)',
                          },
                          '&:disabled': {
                            background: '#ccc',
                          },
                        }}
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                            Generating...
                          </>
                        ) : (
                          '✨ Generate Itinerary'
                        )}
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          )}
        </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 10 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: alpha('#2196F3', 0.08),
              flex: 1,
              borderRadius: 3,
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              AI-Generated Itineraries
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete trip plans with flights, hotels, activities & dining in seconds
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: alpha('#4CAF50', 0.08),
              flex: 1,
              borderRadius: 3,
            }}
          >
            <TrendingDown sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Smart Budget Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time monitoring with recommendations under your budget
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: alpha('#FF9800', 0.08),
              flex: 1,
              borderRadius: 3,
            }}
          >
            <LocalOffer sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Best Deals
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Curated offers and packages for destinations worldwide
            </Typography>
          </Paper>
        </Stack>

        {/* Hot Deals Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ mb: 5, fontWeight: 'bold', textAlign: 'center' }}
          >
            🔥 Hot Deals This Week
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {deals.map((deal) => (
              <Card
                key={deal.destination}
                sx={{
                  flex: 1,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: 8,
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={deal.image}
                    alt={deal.destination}
                  />
                  <Chip
                    label={deal.discount}
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {deal.destination}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {deal.duration} • All Inclusive
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mt: 2 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {deal.price}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      {deal.originalPrice}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Start Your Adventure?
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.95 }}>
            Let AI create your perfect itinerary in seconds
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setShowForm(true)}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              borderRadius: 3,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.95)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            Get Started Free
          </Button>
        </Box>
      </Container>
    </Box>
    </LocalizationProvider>
  );
}
