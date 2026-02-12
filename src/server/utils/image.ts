export const normalizeImageUrl = (imageUrl?: string | null): string | null => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('uploads/')) {
    return `/${imageUrl}`;
  }

  try {
    const parsedUrl = new URL(imageUrl);
    if (parsedUrl.pathname.startsWith('/uploads/')) {
      return parsedUrl.pathname;
    }
  } catch {
    // ignore invalid absolute URL parse
  }

  const uploadsPathIndex = imageUrl.indexOf('/uploads/');
  if (uploadsPathIndex >= 0) {
    return imageUrl.slice(uploadsPathIndex);
  }

  return imageUrl;
};