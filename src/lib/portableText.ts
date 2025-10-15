import {toHTML, type PortableTextMarkComponent} from '@portabletext/to-html';
import type {PortableTextBlock} from '@portabletext/types';
import {urlForImage} from './sanity';

type LinkValue = {
  href?: string;
};

const htmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const link: PortableTextMarkComponent<LinkValue> = ({children, value}) => {
  const href = typeof value?.href === 'string' ? value.href : '#';
  const rel = href?.startsWith('/') ? '' : ' rel="noopener noreferrer"';
  return `<a href="${htmlEscape(href)}"${rel} class="underline decoration-[#87A291] underline-offset-4">${children}</a>`;
};

export const portableTextToHtml = (blocks: PortableTextBlock[] = []) =>
  toHTML(blocks, {
    components: {
      marks: {
        link,
      },
      types: {
        image: ({value}) => {
          if (!value?.asset) return '';
          const alt = typeof value?.alt === 'string' ? htmlEscape(value.alt) : '';
          const src = urlForImage(value).width(1200).url();
          if (!src) return '';
          return `<figure class="my-8"><img src="${src}" alt="${alt}" class="w-full rounded-xl" /></figure>`;
        },
      },
    },
  });

export const toPlainText = (blocks: PortableTextBlock[] = []) =>
  blocks
    .filter((block) => block._type === 'block' && Array.isArray(block.children))
    .flatMap((block) => block.children ?? [])
    .map((child) => (typeof (child as {text?: string}).text === 'string' ? child.text : ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
