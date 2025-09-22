import {createClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.SANITY_PROJECT_ID || 'cpe0lcma';
const dataset = import.meta.env.SANITY_DATASET || 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION || '2024-01-01';
const token = import.meta.env.SANITY_API_READ_TOKEN;
const useCdn = !token && (import.meta.env.SANITY_USE_CDN ?? 'true') !== 'false';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn,
});

const imageBuilder = imageUrlBuilder(sanityClient);

export const urlForImage = (source: Parameters<typeof imageBuilder.image>[0]) =>
  imageBuilder.image(source);
