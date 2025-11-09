import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CCF Animal Welfare - Committee for Campus Fauna',
    short_name: 'CCF Animal Welfare',
    description:
      'Comprehensive digital platform for campus animal care and volunteer coordination at IIT Roorkee',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdf2f8',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
