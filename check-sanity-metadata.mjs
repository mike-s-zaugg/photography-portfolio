#!/usr/bin/env node
/**
 * Check what metadata Sanity has for uploaded images
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'guh7e7hq',
  dataset: 'production',
  useCdn: false, // Use live API, not CDN
  apiVersion: '2026-01-29',
});

async function checkSanityMetadata() {
  try {
    // Get all gallery images from projects
    const query = `*[_type == "project"].gallery[].asset->._id`;
    const assetIds = await client.fetch(query);
    
    if (!assetIds.length) {
      console.log('❌ No gallery images found in Sanity');
      return;
    }
    
    console.log(`Found ${assetIds.length} images in Sanity\n`);
    
    // Check each asset for metadata
    for (const assetId of assetIds.slice(0, 5)) { // Check first 5
      const asset = await client.getDocument(assetId);
      
      console.log(`📷 Asset: ${asset.originalFilename || assetId}`);
      console.log(`   URL: ${asset.url}`);
      
      if (asset.metadata) {
        console.log(`   ✅ Metadata found:`);
        if (asset.metadata.exif) {
          console.log(`      ISO: ${asset.metadata.exif.iso}`);
          console.log(`      F-Number: ${asset.metadata.exif.fNumber}`);
          console.log(`      Exposure Time: ${asset.metadata.exif.exposureTime}`);
          console.log(`      Lens Model: ${asset.metadata.exif.lensModel}`);
        } else {
          console.log(`      ❌ No EXIF metadata`);
        }
      } else {
        console.log(`      ❌ No metadata at all`);
      }
      console.log();
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSanityMetadata();
