import type {PortableTextBlock} from '@portabletext/types';
import {sanityClient} from './sanity';
export {toPlainText} from './portableText';

export type NewsPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  content: PortableTextBlock[];
};

const pad = (value: number) => value.toString().padStart(2, '0');

export const getNewsPermalink = (post: Pick<NewsPost, 'slug' | 'publishedAt'>) => {
  const date = new Date(post.publishedAt);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  return `/frettir/${year}/${month}/${day}/${post.slug}`;
};

const newsProjection = `{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  content
}`;

export const getLatestNews = async (limit = 3) =>
  sanityClient.fetch<NewsPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit] ${newsProjection}`,
    {limit}
  );

export const getAllNews = async () =>
  sanityClient.fetch<NewsPost[]>(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${newsProjection}`
  );

export const getNewsBySlug = async (slug: string) =>
  sanityClient.fetch<NewsPost | null>(
    `*[_type == "post" && slug.current == $slug][0] ${newsProjection}`,
    {slug}
  );
