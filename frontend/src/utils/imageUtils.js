// Local room images — 92 unique photos in /public/images/rooms/
// Only these images are ever shown. No external URLs used.

// Images are now sequentially named room-1.jpg through room-92.jpg
const TOTAL_LOCAL_IMAGES = 92;
const LOCAL_IMAGE_NUMS = Array.from({ length: 92 }, (_, i) => i + 1); // [1, 2, 3, ..., 92]

/**
 * Given any room id + index, return a STABLE local image path.
 * Always resolves to /images/rooms/room-N.jpg — never an external URL.
 */
export const getSafeImageUrl = (url, index = 0, uniqueId = '') => {
  // Build a stable numeric hash from uniqueId + index
  const seed = String(uniqueId || '') + String(index || '');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const num = LOCAL_IMAGE_NUMS[hash % LOCAL_IMAGE_NUMS.length];
  return `/images/rooms/room-${num}.jpg`;
};

/**
 * Generate exactly `count` unique local image paths for a room gallery.
 * Used by RoomDetails to show 15 images.
 */
export const getRoomGalleryImages = (roomId, count = 15) => {
  const seed = String(roomId || 'room');
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Start from a position in the array and cycle through
  const images = [];
  for (let i = 0; i < count; i++) {
    const idx = (hash + i * 7) % LOCAL_IMAGE_NUMS.length;
    const num = LOCAL_IMAGE_NUMS[idx];
    images.push({
      url: `/images/rooms/room-${num}.jpg`,
      publicId: `local_${num}`,
      caption: i === 0 ? 'Main View' : `Room View ${i + 1}`,
      isPrimary: i === 0,
    });
  }
  return images;
};

// City images — also local (use room images with fixed mapping)
export const CITY_IMAGES = {
  Bangalore: '/images/rooms/room-1.jpg',
  Delhi:     '/images/rooms/room-7.jpg',
  Mumbai:    '/images/rooms/room-14.jpg',
  Pune:      '/images/rooms/room-22.jpg',
  Chennai:   '/images/rooms/room-30.jpg',
  Kolkata:   '/images/rooms/room-38.jpg',
  Hyderabad: '/images/rooms/room-45.jpg',
  Ahmedabad: '/images/rooms/room-55.jpg',
  Jaipur:    '/images/rooms/room-65.jpg',
  Noida:     '/images/rooms/room-75.jpg',
};
