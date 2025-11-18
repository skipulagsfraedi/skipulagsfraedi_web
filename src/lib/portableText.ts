import {toHTML, type PortableTextMarkComponent} from '@portabletext/to-html';
import type {PortableTextBlock, TypedObject} from '@portabletext/types';
import {urlForImage} from './sanity';

type LinkValue = TypedObject & {
  href?: string;
};

type CollapsibleListItem = {
  _key?: string;
  title?: string;
  body?: PortableTextBlock[];
};

type CollapsibleListValue = TypedObject & {
  title?: string;
  items?: CollapsibleListItem[];
};

const htmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const link: PortableTextMarkComponent<LinkValue> = ({children, value}) => {
  const href = typeof value?.href === 'string' ? value.href : '#';
  const rel = href?.startsWith('/') ? '' : ' rel="noopener noreferrer"';
  return `<a href="${htmlEscape(href)}"${rel} class="underline decoration-[#87A291] underline-offset-4">${children}</a>`;
};

const ICON_PLUS =
  '<svg class="portable-collapsible__icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>';

const ICON_MINUS =
  '<svg class="portable-collapsible__icon-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>';

const renderPortableText = (blocks: PortableTextBlock[] = []) =>
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
        collapsibleList: ({value}) =>
          renderCollapsibleList(value as CollapsibleListValue),
      },
    },
  });

export const portableTextToHtml = (blocks: PortableTextBlock[] = []) =>
  renderPortableText(blocks);

export const toPlainText = (blocks: PortableTextBlock[] = []) =>
  collectPlainText(blocks)
    .replace(/\s+/g, ' ')
    .trim();

function renderCollapsibleList(value: CollapsibleListValue | undefined): string {
  if (!value || !Array.isArray(value.items)) {
    return '';
  }

  const items = value.items.filter(
    (item): item is CollapsibleListItem & {body: PortableTextBlock[]} =>
      Array.isArray(item?.body) && item.body.length > 0,
  );

  if (items.length === 0) {
    return '';
  }

  const heading = value.title?.trim()
    ? `<h3 class="portable-collapsible__title">${htmlEscape(value.title)}</h3>`
    : '';
  const itemsHtml = items.map((item) => renderCollapsibleItem(item)).join('');
  const parts = ['<section class="portable-collapsible">'];
  if (heading) {
    parts.push(heading);
  }
  parts.push('<div class="portable-collapsible__items">', itemsHtml, '</div></section>');
  return parts.join('');
}

function renderCollapsibleItem(
  item: CollapsibleListItem & {body: PortableTextBlock[]},
): string {
  const summary = item.title?.trim() ? htmlEscape(item.title) : 'Atriði';
  const previewText = getCollapsiblePreview(item.body);
  const previewHtml = previewText
    ? `<span class="portable-collapsible__summary-preview">${htmlEscape(previewText)}</span>`
    : '';
  const summaryHtml = [
    '<span class="portable-collapsible__summary">',
    `<span class="portable-collapsible__summary-title">${summary}</span>`,
    previewHtml,
    '</span>',
  ].join('');
  const bodyHtml = renderPortableText(item.body);
  return [
    '<details class="portable-collapsible__item">',
    '<summary>',
    summaryHtml,
    `<span class="portable-collapsible__icon" aria-hidden="true">${ICON_PLUS}${ICON_MINUS}</span>`,
    '</summary>',
    `<div class="portable-collapsible__content">${bodyHtml}</div>`,
    '</details>',
  ].join('');
}

function getCollapsiblePreview(blocks: PortableTextBlock[] = []): string {
  return collectPlainText(blocks)
    .replace(/\s+/g, ' ')
    .trim();
}

function collectPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks.map((block) => blockToPlainText(block)).join(' ');
}

function blockToPlainText(block: PortableTextBlock): string {
  if (block._type === 'block' && Array.isArray(block.children)) {
    return block.children
      .map((child) =>
        typeof (child as {text?: string}).text === 'string'
          ? (child as {text?: string}).text
          : '',
      )
      .join(' ');
  }

  if (block._type === 'collapsibleList') {
    return collapsibleToPlainText(block as CollapsibleListValue);
  }

  return '';
}

function collapsibleToPlainText(value: CollapsibleListValue): string {
  const title = typeof value.title === 'string' ? value.title : '';
  const itemsText = Array.isArray(value.items)
    ? value.items
        .map((item) => {
          const fragments: string[] = [];
          if (typeof item?.title === 'string') {
            fragments.push(item.title);
          }
          if (Array.isArray(item?.body)) {
            fragments.push(collectPlainText(item.body as PortableTextBlock[]));
          }
          return fragments.join(' ');
        })
        .join(' ')
    : '';
  return [title, itemsText].filter(Boolean).join(' ');
}
