// web/src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'guh7e7hq', // <--- Hier einfügen!
  dataset: 'production',
  useCdn: true, // true für schnelle Cache-Antworten
  apiVersion: '2026-01-29', // Aktuelles Datum oder Version
});

// Helper um Bild-URLs zu generieren
const builder = createImageUrlBuilder(sanityClient);

// Robust urlFor: handle cases where the document already contains an `asset.url`
// (for example when the query projects asset-> { url }) or when asset is missing.
export function urlFor(source: any) {
  if (!source) {
    return {
      width: () => ({ url: () => '' }),
      url: () => '',
    };
  }

  // If the gallery item was expanded to include asset->{url,...}, use that URL directly
  if (source.asset && typeof source.asset.url === 'string') {
    const directUrl = source.asset.url;
    return {
      width: () => ({ url: () => directUrl }),
      url: () => directUrl,
    };
  }

  // Otherwise fall back to the image URL builder
  try {
    return builder.image(source);
  } catch (err) {
    // If builder fails (e.g. null ref), return a safe stub
    return {
      width: () => ({ url: () => '' }),
      url: () => '',
    };
  }
}