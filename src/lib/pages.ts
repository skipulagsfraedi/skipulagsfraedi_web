import type {PortableTextBlock} from '@portabletext/types';
import {sanityClient} from './sanity';

export type PageReference = {
  _id: string;
  title: string;
  slug: string;
};

export type PageDocument = PageReference & {
  content: PortableTextBlock[];
  parent?: PageReference;
  orderRank?: string | null;
};

const basePageFilter =
  '*[_type == "page" && defined(slug.current) && !(_id in path("drafts.**"))]';

const pageProjection = `{
  _id,
  title,
  "slug": slug.current,
  "content": coalesce(content, []),
  "orderRank": coalesce(orderRank, ''),
  parent->{
    _id,
    title,
    "slug": slug.current
  }
}`;

export const getAllPages = async () =>
  sanityClient.fetch<PageDocument[]>(
    `${basePageFilter} | order(orderRank) ${pageProjection}`
  );

export type PageTreeItem = PageReference & {
  children: PageReference[];
};

export const getPageTree = async () =>
  sanityClient.fetch<PageTreeItem[]>(
    `*[_type == "page" && !defined(parent) && defined(slug.current) && !(_id in path("drafts.**"))] | order(orderRank) {
      _id,
      title,
      "slug": slug.current,
      "children": *[_type == "page" && references(^._id) && defined(slug.current) && !(_id in path("drafts.**"))] | order(orderRank) {
        _id,
        title,
        "slug": slug.current
      }
    }`
  );
