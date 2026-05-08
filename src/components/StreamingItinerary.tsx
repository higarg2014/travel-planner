import { Box, Container, Paper, Typography, CircularProgress, Stack } from '@mui/material';
import { Flight, Hotel, Restaurant, LocalActivity } from '@mui/icons-material';

interface Props {
  streamedText: string;
}

const loadingSteps = [
  { icon: Flight, text: 'Finding best flight options...' },
  { icon: Hotel, text: 'Selecting perfect accommodations...' },
  { icon: Restaurant, text: 'Discovering local restaurants...' },
  { icon: LocalActivity, text: 'Planning exciting activities...' },
];

export default function StreamingItinerary({ streamedText }: Props) {
  // Calculate progress based on streamed text length
  const progress = Math.min(Math.floor((streamedText.length / 3000) * 100), 95);
  const currentStepIndex = Math.floor((progress / 100) * loadingSteps.length);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <CircularProgress
              variant="determinate"
              value={progress}
              size={80}
              thickness={4}
              sx={{
                color: '#667eea',
                mb: 3,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
              Creating Your Itinerary
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {progress}% Complete
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ mb: 4 }}>
            {loadingSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStepIndex;
              const isComplete = index < currentStepIndex;

              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    opacity: isComplete ? 0.5 : isActive ? 1 : 0.3,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <StepIcon
                    sx={{
                      fontSize: 30,
                      color: isComplete ? 'success.main' : isActive ? 'primary.main' : 'text.secondary',
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {step.text}
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Powered by Google Gemini AI
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
