
/**
 * Converts various YouTube URL formats into a valid embed URL.
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already an embed URL, return it
  if (url.includes('youtube.com/embed/')) return url;

  let videoId = '';

  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || '';
      // Handle cases like /embed/ or /v/ if they are passed as full URLs
      if (!videoId && urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/')[2];
      }
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }
  } catch (e) {
    // If URL parsing fails, try a simple regex as fallback
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]+)/);
    if (match) videoId = match[1];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};
