#!/bin/bash

echo "Building project..."
npm run build

echo ""
echo "✅ Build complete! Deploy the 'dist' folder to:"
echo "   • Vercel: npx vercel deploy dist --prod"
echo "   • Netlify: npx netlify deploy --prod --dir=dist"
echo "   • Firebase: firebase deploy"
echo ""
echo "Or manually upload the 'dist' folder to any static host"
