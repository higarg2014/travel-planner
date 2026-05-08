import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Alert,
  Tabs,
  Tab,
  Rating,
  IconButton,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalActivity as ActivityIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import type { Itinerary } from '../types/itinerary';

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

export default function ItineraryDisplay({ itinerary, onReset }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const budgetColor = itinerary.budgetStatus === 'under' ? 'success' : itinerary.budgetStatus === 'over' ? 'error' : 'info';

  const currentDay = itinerary.dailyPlans[selectedDay];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper elevation={10} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                Your Trip to {itinerary.destination}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                {itinerary.hotel.checkIn} - {itinerary.hotel.checkOut}
              </Typography>
            </Box>
            <Button variant="outlined" size="large" onClick={onReset} sx={{ borderRadius: 3 }}>
              Plan Another Trip
            </Button>
          </Box>

          {/* Budget Summary */}
          <Alert severity={budgetColor} sx={{ mt: 3, borderRadius: 2 }}>
            <Typography variant="h6">
              Total Cost: ${itinerary.totalCost.toLocaleString()}
            </Typography>
            <Typography variant="body2">
              {itinerary.budgetStatus === 'under' && 'Under budget! 🎉'}
              {itinerary.budgetStatus === 'over' && 'Over budget'}
              {itinerary.budgetStatus === 'exact' && 'Exactly on budget!'}
            </Typography>
          </Alert>
        </Paper>

        {/* Day Tabs */}
        <Paper elevation={10} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
            <Tabs
              value={selectedDay}
              onChange={(_, newValue) => setSelectedDay(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  minWidth: 120,
                },
                '& .Mui-selected': {
                  color: 'white !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                  height: 3,
                },
              }}
            >
              {itinerary.dailyPlans.map((day, index) => (
                <Tab
                  key={day.day}
                  label={`Day ${day.day}`}
                  value={index}
                />
              ))}
            </Tabs>
          </Box>

          {/* Current Day Content */}
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea', mb: 3 }}>
              Day {currentDay.day} - {currentDay.date}
            </Typography>

            {/* Activities Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <ActivityIcon sx={{ mr: 1, color: 'primary.main' }} />
                Activities
              </Typography>
              <Grid container spacing={3}>
                {currentDay.activities.map((activity, i) => (
                  <Grid size={{ xs: 12, md: 6 }} key={i}>
                    <Card
                      elevation={4}
                      sx={{
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 8,
                        },
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip
                            label={activity.time}
                            size="small"
                            color={activity.time === 'morning' ? 'info' : activity.time === 'afternoon' ? 'warning' : 'secondary'}
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.name + ' ' + itinerary.destination)}`, '_blank')}
                          >
                            <LocationIcon color="primary" />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {activity.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating value={4.5} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            (4.5)
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {activity.description}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Duration: {activity.duration}
                          </Typography>
                          <Chip label={`$${activity.price}`} color="primary" size="small" icon={<MoneyIcon />} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Restaurants Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                Dining
              </Typography>
              <Grid container spacing={3}>
                {currentDay.restaurants.map((restaurant, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Card
                      elevation={4}
                      sx={{
                        height: '100%',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 8,
                        },
                        borderRadius: 3,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Chip
                            label={restaurant.meal}
                            size="small"
                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                            color="secondary"
                          />
                          <IconButton
                            size="small"
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ' ' + itinerary.destination)}`, '_blank')}
                          >
                            <LocationIcon color="primary" />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {restaurant.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Rating value={4.3} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            (4.3)
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {restaurant.cuisine} • {restaurant.priceRange}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                          ~${restaurant.estimatedCost}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Hotel Section */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <HotelIcon sx={{ mr: 1, color: 'primary.main' }} />
                Your Hotel
              </Typography>
              <Card
                elevation={4}
                sx={{
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8,
                  },
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {itinerary.hotel.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={itinerary.hotel.rating} readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({itinerary.hotel.rating} stars)
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary">
                        {itinerary.hotel.checkIn} to {itinerary.hotel.checkOut}
                      </Typography>
                    </Box>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itinerary.hotel.name + ' ' + itinerary.destination)}`, '_blank')}
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Amenities:
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                      {itinerary.hotel.amenities.map((amenity, i) => (
                        <Chip key={i} label={amenity} size="medium" color="primary" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(102, 126, 234, 0.1)', p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${itinerary.hotel.pricePerNight}/night
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                      Total: ${itinerary.hotel.totalPrice}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>

        {/* Flights Section */}
        <Paper elevation={10} sx={{ p: 4, mb: 4, borderRadius: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            <FlightIcon sx={{ mr: 1, color: 'primary.main' }} />
            Flights
          </Typography>
          <Grid container spacing={3}>
            {itinerary.flights.map((flight, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  elevation={4}
                  sx={{
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                    },
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {flight.type === 'outbound' ? '✈️ Outbound Flight' : '🔄 Return Flight'}
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {flight.airline}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {flight.flightNumber} • {flight.duration}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ my: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>From:</strong> {flight.departure.airport}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {flight.departure.time}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1, mt: 2 }}>
                        <strong>To:</strong> {flight.arrival.airport}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {flight.arrival.time}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Chip label={`$${flight.price}`} color="primary" size="medium" icon={<MoneyIcon />} sx={{ fontWeight: 'bold', fontSize: '1rem', px: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={onReset}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              borderRadius: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, .4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5568d3 30%, #654a8f 90%)',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 25px rgba(102, 126, 234, .6)',
              },
              transition: 'all 0.3s',
            }}
          >
            Plan Another Trip
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
