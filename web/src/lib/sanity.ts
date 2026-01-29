// web/src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'guh7e7hq', // <--- Hier einfügen!
  dataset: 'production',
  useCdn: true, // true für schnelle Cache-Antworten
  apiVersion: '2026-01-29', // Aktuelles Datum oder Version
});

// Helper um Bild-URLs zu generieren
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}