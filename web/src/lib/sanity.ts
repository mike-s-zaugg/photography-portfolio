// web/src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'guh7e7hq', 
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-29',
});

const builder = createImageUrlBuilder(sanityClient);

// Helper: Ein "Fake"-Builder, der alle Methoden schluckt und am Ende einfach die URL ausspuckt.
// Verhindert Abstürze wie "width(...).height is not a function"
const mockBuilder = (url: string) => {
  const chain = {
    width: () => chain,
    height: () => chain,
    fit: () => chain,
    auto: () => chain,
    url: () => url // Am Ende kommt der String raus
  };
  return chain;
};

export function urlFor(source: any) {
  // 1. Guard: Wenn gar kein Bild da ist
  if (!source || !source.asset) {
    return mockBuilder('');
  }

  // 2. Fall: Das Bild hat schon eine fertige URL (z.B. direkt aus dem Query)
  if (typeof source.asset.url === 'string') {
    return mockBuilder(source.asset.url);
  }

  // 3. Fall: Asset Objekt ist kaputt (kein _ref und keine URL)
  if (typeof source.asset === 'object' && !source.asset._ref && !source.asset.url) {
    return mockBuilder('');
  }

  // 4. Normalfall: Wir nutzen den echten Sanity Builder
  try {
    return builder.image(source);
  } catch (err) {
    // Falls selbst der echte Builder crasht (z.B. ungültige ID), fangen wir es ab
    return mockBuilder('');
  }
}