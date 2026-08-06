/**
 * Helper to process media URLs (YouTube video embeds, PDF documents, and static images)
 */

export function formatVideoEmbedUrl(url: string): { isYouTube: boolean; embedUrl: string } {
  if (!url) return { isYouTube: false, embedUrl: url };

  if (url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('youtube.com/embed')) {
    let videoId = '';
    if (url.includes('youtube.com/watch')) {
      const match = url.match(/v=([a-zA-Z0-9_-]+)/);
      if (match) videoId = match[1];
    } else if (url.includes('youtu.be/')) {
      const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) videoId = match[1];
    } else if (url.includes('youtube.com/embed/')) {
      const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
      if (match) videoId = match[1];
    }

    if (videoId) {
      return {
        isYouTube: true,
        embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`
      };
    }
  }

  return { isYouTube: false, embedUrl: url };
}

export function formatAssetUrl(url: string, type: 'image' | 'pdf' | 'video' = 'image'): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Local repo static fallback paths
  if (type === 'pdf' && !url.startsWith('/documents/') && !url.startsWith('/')) {
    return `/documents/${url}`;
  }
  if (type === 'image' && !url.startsWith('/images/') && !url.startsWith('/')) {
    return `/images/${url}`;
  }
  return url;
}
