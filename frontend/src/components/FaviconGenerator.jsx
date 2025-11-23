import React, { useEffect } from 'react';

const FaviconGenerator = () => {
  useEffect(() => {
    // Create proper icons for different sizes
    const createIcon = (size) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = size;
      canvas.height = size;

      // Scale factor for different sizes
      const scale = size / 32;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#ff6b35');
      gradient.addColorStop(0.25, '#f7931e');
      gradient.addColorStop(0.5, '#ff1744');
      gradient.addColorStop(0.75, '#e91e63');
      gradient.addColorStop(1, '#9c27b0');

      // Draw rounded rectangle background
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(2 * scale, 2 * scale, (size - 4), (size - 4), 6 * scale);
      ctx.fill();

      // Draw MESS/food container icon in white
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      
      // Main food container
      ctx.beginPath();
      ctx.roundRect(6 * scale, 12 * scale, 20 * scale, 14 * scale, 3 * scale);
      ctx.fill();
      
      // Container lid
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.roundRect(7 * scale, 10 * scale, 18 * scale, 3 * scale, 1.5 * scale);
      ctx.fill();
      
      // Food compartments
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.roundRect(9 * scale, 15 * scale, 4 * scale, 3 * scale, 1 * scale);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(14 * scale, 15 * scale, 4 * scale, 3 * scale, 1 * scale);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(19 * scale, 15 * scale, 3 * scale, 3 * scale, 1 * scale);
      ctx.fill();
      
      ctx.beginPath();
      ctx.roundRect(9 * scale, 19 * scale, 6 * scale, 2 * scale, 1 * scale);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(16 * scale, 19 * scale, 6 * scale, 2 * scale, 1 * scale);
      ctx.fill();
      
      // Steam lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5 * scale;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(12 * scale, 6 * scale);
      ctx.lineTo(12 * scale, 9 * scale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(16 * scale, 5 * scale);
      ctx.lineTo(16 * scale, 9 * scale);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(20 * scale, 6 * scale);
      ctx.lineTo(20 * scale, 9 * scale);
      ctx.stroke();

      return canvas.toDataURL('image/png');
    };

    // Generate icons for different sizes
    const favicon32 = createIcon(32);
    const favicon192 = createIcon(192);
    const favicon512 = createIcon(512);

    // Update favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = favicon32;

    // Update apple-touch-icon
    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.href = favicon192;

    // Update manifest theme color
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = '#ff6b35';

    // Create dynamic manifest with proper absolute URLs and correct icon sizes
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const manifest = {
      name: 'MESS WALLAH - Find Your Perfect Accommodation',
      short_name: 'MESS WALLAH',
      description: 'Find and book affordable mess rooms and student accommodations across India',
      start_url: `${baseUrl}/`,
      scope: `${baseUrl}/`,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ff6b35',
      orientation: 'portrait-primary',
      icons: [
        {
          src: favicon32,
          sizes: '32x32',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: favicon192,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: favicon512,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ],
      categories: ['lifestyle', 'travel', 'education'],
      lang: 'en-IN',
      dir: 'ltr'
    };

    // Update PWA manifest
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }

    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json'
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    manifestLink.href = manifestUrl;

  }, []);

  return null; // This component doesn't render anything
};

export default FaviconGenerator;
