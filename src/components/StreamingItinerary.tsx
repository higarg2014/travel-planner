import { Box, Container, Paper, Typography, CircularProgress } from '@mui/material';

interface Props {
  streamedText: string;
}

export default function StreamingItinerary({ streamedText }: Props) {
  // Extract only the text before any JSON code block
  const displayText = streamedText.split('```')[0] || streamedText;

  // Simple parsing to show progress
  const lines = displayText.split('\n').filter(line => line.trim());

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, minHeight: '70vh' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <CircularProgress size={60} sx={{ color: '#667eea', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
              ✨ Crafting Your Perfect Trip...
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              AI is analyzing the best flights, hotels, and activities for you
            </Typography>
          </Box>

          <Box
            sx={{
              maxHeight: '60vh',
              overflowY: 'auto',
              '& > *': { mb: 1.5 },
            }}
          >
            {lines.length > 0 ? (
              lines.map((line, index) => {
                const isHeading = line.startsWith('#');
                const isBullet = line.trim().startsWith('*') || line.trim().startsWith('-');

                return (
                  <Typography
                    key={index}
                    variant={isHeading ? 'h6' : 'body1'}
                    sx={{
                      color: isHeading ? '#667eea' : 'text.primary',
                      fontWeight: isHeading ? 'bold' : 'normal',
                      pl: isBullet ? 3 : 0,
                      opacity: 0,
                      animation: 'fadeIn 0.3s forwards',
                      animationDelay: `${index * 0.05}s`,
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                      },
                    }}
                  >
                    {line.replace(/^#+\s*/, '').replace(/^\*\s*/, '• ').replace(/^-\s*/, '• ')}
                  </Typography>
                );
              })
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Starting AI generation...
              </Typography>
            )}
          </Box>

          {/* Blinking cursor effect */}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '3px',
              height: '20px',
              bgcolor: '#667eea',
              ml: 1,
              animation: 'blink 1s infinite',
              '@keyframes blink': {
                '0%, 49%': { opacity: 1 },
                '50%, 100%': { opacity: 0 },
              },
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}
