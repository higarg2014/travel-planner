import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import { Flight, Hotel, Restaurant, LocalActivity, CheckCircle } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const steps = [
  { icon: Flight, text: 'Finding best flights...', duration: 2000 },
  { icon: Hotel, text: 'Selecting perfect hotels...', duration: 2500 },
  { icon: Restaurant, text: 'Discovering local restaurants...', duration: 2000 },
  { icon: LocalActivity, text: 'Curating activities...', duration: 2500 },
  { icon: CheckCircle, text: 'Finalizing your itinerary...', duration: 1500 },
];

export default function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;
    let cycleCount = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      const cycleProgress = elapsed % totalDuration;

      // Progress bar goes to 95% max, then holds
      const maxProgress = 95;
      const currentProgress = Math.min((elapsed / totalDuration) * 100, maxProgress);
      setProgress(currentProgress);

      // Cycle through steps continuously
      let accumulatedTime = 0;
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration;
        if (cycleProgress < accumulatedTime) {
          setCurrentStep(i);
          break;
        }
      }

      // Check if we completed a full cycle
      if (elapsed >= totalDuration && cycleProgress < 100) {
        cycleCount++;
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 600, px: 3 }}>
        <Box
          sx={{
            mb: 4,
            animation: 'bounce 1s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        >
          <CurrentIcon sx={{ fontSize: 100, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} />
        </Box>

        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Creating Your Perfect Trip
        </Typography>

        <Typography variant="h5" sx={{ mb: 5, opacity: 0.95 }}>
          {steps[currentStep].text}
        </Typography>

        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255,255,255,0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                background: 'linear-gradient(90deg, #21CBF3 0%, #2196F3 100%)',
              },
            }}
          />
        </Box>

        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          {Math.round(progress)}% Complete
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'center' }}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <Box
                key={index}
                sx={{
                  opacity: index <= currentStep ? 1 : 0.3,
                  transition: 'opacity 0.3s',
                }}
              >
                <StepIcon sx={{ fontSize: 30 }} />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
