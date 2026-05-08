import { Box, Container, Paper, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

interface Props {
  streamedText: string;
}

export default function StreamingItinerary({ streamedText }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4, minHeight: '70vh' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea', mb: 3 }}>
            ✨ Generating Your Perfect Trip...
          </Typography>

          <Box
            sx={{
              '& h1, & h2, & h3': { color: '#667eea', fontWeight: 'bold', mt: 3, mb: 2 },
              '& p': { mb: 2, lineHeight: 1.8 },
              '& ul, & ol': { pl: 3, mb: 2 },
              '& li': { mb: 1 },
              '& code': {
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: 'monospace',
              },
              '& pre': {
                bgcolor: 'rgba(102, 126, 234, 0.05)',
                p: 2,
                borderRadius: 2,
                overflow: 'auto',
              },
            }}
          >
            <ReactMarkdown>{streamedText || 'Starting...'}</ReactMarkdown>
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
