import axios from '@/api/clients/axios';

export const profileImageAccept = 'image/jpeg,image/png,image/webp';
const allowedImageTypes = new Set(profileImageAccept.split(','));
const maximumImageBytes = 5 * 1024 * 1024;

export function resolveProfileImageUrl(imageUrl?: string | null): string | undefined {
  if (!imageUrl) return undefined;

  try {
    const apiUrl = new URL(axios.defaults.baseURL || '/', window.location.origin);
    const resolvedUrl = new URL(imageUrl, apiUrl);
    return ['http:', 'https:'].includes(resolvedUrl.protocol) ? resolvedUrl.href : undefined;
  } catch {
    return undefined;
  }
}

export async function validateProfileImage(file: File): Promise<string | null> {
  if (!allowedImageTypes.has(file.type)) return 'Odaberite JPG, PNG ili WebP sliku.';
  if (file.size === 0) return 'Odabrana datoteka je prazna.';
  if (file.size > maximumImageBytes) return 'Slika može imati najviše 5 MB.';

  const imageUrl = URL.createObjectURL(file);
  try {
    await new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => image.naturalWidth > 0 && image.naturalHeight > 0 ? resolve() : reject();
      image.onerror = () => reject();
      image.src = imageUrl;
    });
    return null;
  } catch {
    return 'Datoteka se ne može otvoriti kao slika. Odaberite drugu sliku.';
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
