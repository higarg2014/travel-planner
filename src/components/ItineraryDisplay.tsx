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
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalActivity as ActivityIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import type { Itinerary } from '../types/itinerary';

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

export default function ItineraryDisplay({ itinerary, onReset }: Props) {
  const budgetColor = itinerary.budgetStatus === 'under' ? 'success' : itinerary.budgetStatus === 'over' ? 'error' : 'info';

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h2">
            Your Trip to {itinerary.destination}
          </Typography>
          <Button variant="outlined" onClick={onReset}>
            Plan Another Trip
          </Button>
        </Box>

        {/* Budget Summary */}
        <Alert severity={budgetColor} sx={{ mt: 2 }}>
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

      {/* Flights */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FlightIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">Flights</Typography>
        </Box>
        <Grid container spacing={2}>
          {itinerary.flights.map((flight, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {flight.type === 'outbound' ? '✈️ Outbound' : '🔄 Return'} - {flight.airline}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {flight.flightNumber} • {flight.duration}
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body1">
                      <strong>{flight.departure.airport}</strong> {flight.departure.time} → <strong>{flight.arrival.airport}</strong> {flight.arrival.time}
                    </Typography>
                  </Box>
                  <Chip label={`$${flight.price}`} color="primary" size="small" icon={<MoneyIcon />} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Hotel */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HotelIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">Accommodation</Typography>
        </Box>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">{itinerary.hotel.name}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {'⭐'.repeat(itinerary.hotel.rating)} ({itinerary.hotel.rating} stars)
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              {itinerary.hotel.checkIn} to {itinerary.hotel.checkOut}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Amenities:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                {itinerary.hotel.amenities.map((amenity, i) => (
                  <Chip key={i} label={amenity} size="small" />
                ))}
              </Stack>
            </Box>
            <Typography variant="h6" color="primary">
              ${itinerary.hotel.pricePerNight}/night • Total: ${itinerary.hotel.totalPrice}
            </Typography>
          </CardContent>
        </Card>
      </Paper>

      {/* Daily Itinerary */}
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <ActivityIcon sx={{ mr: 1, color: 'primary.main' }} />
        Daily Itinerary
      </Typography>

      {itinerary.dailyPlans.map((day) => (
        <Paper key={day.day} elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Day {day.day} - {day.date}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Activities */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Activities
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {day.activities.map((activity, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Chip
                      label={activity.time}
                      size="small"
                      sx={{ mb: 1 }}
                      color={activity.time === 'morning' ? 'info' : activity.time === 'afternoon' ? 'warning' : 'secondary'}
                    />
                    <Typography variant="h6" gutterBottom>
                      {activity.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      Duration: {activity.duration}
                    </Typography>
                    <Chip label={`$${activity.price}`} size="small" sx={{ mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Restaurants */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            <RestaurantIcon sx={{ mr: 0.5, fontSize: 20, verticalAlign: 'middle' }} />
            Dining
          </Typography>
          <Grid container spacing={2}>
            {day.restaurants.map((restaurant, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card variant="outlined">
                  <CardContent>
                    <Chip
                      label={restaurant.meal}
                      size="small"
                      sx={{ mb: 1, textTransform: 'capitalize' }}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      {restaurant.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.cuisine} • {restaurant.priceRange}
                    </Typography>
                    <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                      ~${restaurant.estimatedCost}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      {/* Footer */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Button variant="contained" size="large" onClick={onReset}>
          Plan Another Trip
        </Button>
      </Box>
    </Container>
  );
}
