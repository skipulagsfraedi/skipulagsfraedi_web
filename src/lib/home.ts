// src/lib/home.ts
import {sanityClient} from './sanity';

type SanityImageAsset = {
  _type: 'reference';
  _ref: string;
  asset?: {
    _ref: string;
    _type: 'reference';
  };
};

type SanityImageWithAlt = {
  asset: SanityImageAsset;
  alt?: string;
};

type SanityCtaInput = {
  label?: string;
  href?: string;
};

type Cta = {
  label: string;
  href: string;
};

// Section input types from Sanity
type HeroSectionInput = {
  _type: 'heroSection';
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: SanityImageWithAlt;
  primaryCta?: SanityCtaInput;
  secondaryCta?: SanityCtaInput;
};

type NewsSectionInput = {
  _type: 'newsSection';
  badge?: string;
  title?: string;
  description?: string;
  readMoreLabel?: string;
  cta?: SanityCtaInput;
};

type TeamSectionInput = {
  _type: 'teamSection';
  title?: string;
  description?: string;
};

type PillarItemInput = {
  title?: string;
  description?: string;
};

type PillarsSectionInput = {
  _type: 'pillarsSection';
  badge?: string;
  title?: string;
  description?: string;
  items?: PillarItemInput[];
};

type ContactSectionInput = {
  _type: 'contactSection';
  title?: string;
  lead?: string;
  email?: string;
  note?: string;
};

type FrontpageSectionInput =
  | TeamSectionInput
  | PillarsSectionInput
  | ContactSectionInput;

type FrontpageContentDocument = {
  hero?: HeroSectionInput;
  news?: NewsSectionInput;
  sections?: FrontpageSectionInput[];
};

type SiteSettingsDocument = {
  footerNotice?: string;
  footerEmail?: string;
};

// Processed section types
export type FrontpageHero = {
  _type: 'heroSection';
  badge: string;
  title: string;
  subtitle: string;
  image?: SanityImageWithAlt;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type FrontpageNews = {
  _type: 'newsSection';
  badge: string;
  title: string;
  description: string;
  readMoreLabel: string;
  cta: Cta;
};

export type FrontpageTeam = {
  _type: 'teamSection';
  title: string;
  description: string;
};

export type FrontpagePillarItem = {
  title: string;
  description: string;
};

export type FrontpagePillars = {
  _type: 'pillarsSection';
  badge: string;
  title: string;
  description: string;
  items: FrontpagePillarItem[];
};

export type FrontpageContact = {
  _type: 'contactSection';
  title: string;
  lead: string;
  email: string;
  note: string;
};

export type FrontpageSection =
  | FrontpageTeam
  | FrontpagePillars
  | FrontpageContact;

export type FrontpageContent = {
  hero: FrontpageHero;
  news?: FrontpageNews;
  sections: FrontpageSection[];
};

export type FooterCopy = {
  notice: string;
  email: string;
};

const FRONT_PAGE_QUERY = `*[_type == "frontpageContent"][0]{
  hero {
    badge,
    title,
    subtitle,
    image {
      asset,
      alt
    },
    primaryCta {
      label,
      href
    },
    secondaryCta {
      label,
      href
    }
  },
  news {
    badge,
    title,
    description,
    readMoreLabel,
    cta {
      label,
      href
    }
  },
  sections[] {
    _type,
    _type == "teamSection" => {
      title,
      description
    },
    _type == "pillarsSection" => {
      badge,
      title,
      description,
      items[] {
        title,
        description
      }
    },
    _type == "contactSection" => {
      title,
      lead,
      email,
      note
    }
  }
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  footerNotice,
  footerEmail
}`;

// Default values for each section type
const DEFAULT_HERO: Omit<FrontpageHero, '_type'> = {
  badge: 'Vefur í vinnslu',
  title: 'Skipulagsfræði skapar sveigjanlegar lausnir fyrir íslenskt skipulag',
  subtitle:
    'Við vinnum með sveitarfélögum, stofnunum og samstarfsaðilum að því að skilgreina og móta nýju kynslóðina af borgarrýmum. Þessi síða er í uppbyggingu en hér má finna helstu upplýsingar og tengiliði.',
  primaryCta: {
    label: 'Skoða verkefni',
    href: '#project',
  },
  secondaryCta: {
    label: 'Hafðu samband',
    href: '#contact',
  },
};

const DEFAULT_NEWS: Omit<FrontpageNews, '_type'> = {
  badge: 'Fréttir',
  title: 'Nýjustu tíðindi úr starfseminni',
  description: 'Lestu um verkefni, viðburði og sjónarmið skipulagsfræðinga.',
  readMoreLabel: 'Lesa meira →',
  cta: {
    label: 'Sjá allar fréttir',
    href: '/frettir',
  },
};

const DEFAULT_TEAM: Omit<FrontpageTeam, '_type'> = {
  title: 'Teymið',
  description:
    'Við búum saman til leiðir sem byggja á rannsóknum, innblæstri og samtali við fólkið sem býr í hverfinu. Kynntu þér starfsfólkið og samstarfsaðila fljótlega hér.',
};

const DEFAULT_PILLARS: Omit<FrontpagePillars, '_type'> = {
  badge: 'Skipulag í forgrunni',
  title: 'Hvernig við mótum framtíðarrými',
  description:
    'Við unnum af alúð að lausnum sem gera byggðir að betri stöðum. Hér eru þrír lykilþættir sem leiða vinnuna áfram.',
  items: [
    {
      title: 'Gagnadrifið greiningarferli',
      description:
        'Við lesum í gögnin um hvern stað og kortleggjum tækifæri til að styrkja samfélagið og hagræna innviði.',
    },
    {
      title: 'Samráð og samvinna',
      description:
        'Við leiðum samtal milli íbúa, stofnana og hagsmunaaðila til að tryggja að lausnirnar séu sameiginleg framtíðarsýn.',
    },
    {
      title: 'Árangur sem standast próf',
      description:
        'Við fylgjum verkefnum eftir með mælikvörðum sem sýna raunveruleg áhrif á lífsgæði og umhverfi til lengri tíma.',
    },
  ],
};

const DEFAULT_CONTACT: Omit<FrontpageContact, '_type'> = {
  title: 'Hafðu samband',
  lead: 'Best er að senda okkur línu á',
  email: 'hallo@skipulagsfraedi.is',
  note: 'Við svarum fljótt og erum ávallt opin fyrir samtali um nýjar hugmyndir.',
};

const DEFAULT_FOOTER: FooterCopy = {
  notice: 'Skipulagsfræðingafélag Íslands. Allur réttur áskilinn.',
  email: 'hallo@skipulagsfraedi.is',
};

let cachedFrontpage: FrontpageContentDocument | null | undefined;
let frontpagePromise: Promise<FrontpageContentDocument | null> | null;
let cachedSettings: SiteSettingsDocument | null | undefined;
let settingsPromise: Promise<SiteSettingsDocument | null> | null;

export const getFrontpageDocument = async (): Promise<FrontpageContentDocument | null> => {
  if (typeof cachedFrontpage !== 'undefined') {
    return cachedFrontpage;
  }

  if (!frontpagePromise) {
    frontpagePromise = sanityClient
      .fetch<FrontpageContentDocument | null>(FRONT_PAGE_QUERY)
      .then((content) => {
        cachedFrontpage = content ?? null;
        frontpagePromise = null;
        return cachedFrontpage;
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch frontpage content from Sanity', error);
        cachedFrontpage = null;
        frontpagePromise = null;
        return cachedFrontpage;
      });
  }

  return frontpagePromise;
};

export const getFrontpageContent = async (): Promise<FrontpageContent> => {
  const doc = await getFrontpageDocument();
  const sections = doc?.sections || [];

  return {
    hero: buildHero(doc?.hero || {_type: 'heroSection'}),
    news: doc?.news ? buildNews(doc.news) : undefined,
    sections: sections.map((section) => {
      switch (section._type) {
        case 'teamSection':
          return buildTeam(section);
        case 'pillarsSection':
          return buildPillars(section);
        case 'contactSection':
          return buildContact(section);
        default:
          return null;
      }
    }).filter((section): section is FrontpageSection => section !== null),
  };
};

export const getSiteSettings = async (): Promise<SiteSettingsDocument | null> => {
  if (typeof cachedSettings !== 'undefined') {
    return cachedSettings;
  }

  if (!settingsPromise) {
    settingsPromise = sanityClient
      .fetch<SiteSettingsDocument | null>(SITE_SETTINGS_QUERY)
      .then((settings) => {
        cachedSettings = settings ?? null;
        settingsPromise = null;
        return cachedSettings;
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch site settings from Sanity', error);
        cachedSettings = null;
        settingsPromise = null;
        return cachedSettings;
      });
  }

  return settingsPromise;
};

export const getSiteFooter = async (): Promise<FooterCopy> => {
  const settings = await getSiteSettings();

  if (!settings) {
    return DEFAULT_FOOTER;
  }

  return {
    notice: withFallback(settings.footerNotice, DEFAULT_FOOTER.notice),
    email: withFallback(settings.footerEmail, DEFAULT_FOOTER.email),
  };
};

const buildHero = (input: HeroSectionInput): FrontpageHero => ({
  _type: 'heroSection',
  badge: withFallback(input.badge, DEFAULT_HERO.badge),
  title: withFallback(input.title, DEFAULT_HERO.title),
  subtitle: withFallback(input.subtitle, DEFAULT_HERO.subtitle),
  image: input.image || undefined,
  primaryCta: resolveCta(input.primaryCta, DEFAULT_HERO.primaryCta),
  secondaryCta: resolveCta(input.secondaryCta, DEFAULT_HERO.secondaryCta),
});

const buildNews = (input: NewsSectionInput): FrontpageNews => ({
  _type: 'newsSection',
  badge: withFallback(input.badge, DEFAULT_NEWS.badge),
  title: withFallback(input.title, DEFAULT_NEWS.title),
  description: withFallback(input.description, DEFAULT_NEWS.description),
  readMoreLabel: withFallback(input.readMoreLabel, DEFAULT_NEWS.readMoreLabel),
  cta: resolveCta(input.cta, DEFAULT_NEWS.cta),
});

const buildTeam = (input: TeamSectionInput): FrontpageTeam => ({
  _type: 'teamSection',
  title: withFallback(input.title, DEFAULT_TEAM.title),
  description: withFallback(input.description, DEFAULT_TEAM.description),
});

const buildPillars = (input: PillarsSectionInput): FrontpagePillars => {
  const fallbackItems = DEFAULT_PILLARS.items;
  const docPillars = input.items;
  const customPillars = Array.isArray(docPillars) ? docPillars : [];
  const items =
    customPillars.length > 0
      ? customPillars.map((item, index) => {
          const fallback = fallbackItems[index % fallbackItems.length];
          return {
            title: withFallback(item?.title, fallback.title),
            description: withFallback(item?.description, fallback.description),
          };
        })
      : fallbackItems;

  return {
    _type: 'pillarsSection',
    badge: withFallback(input.badge, DEFAULT_PILLARS.badge),
    title: withFallback(input.title, DEFAULT_PILLARS.title),
    description: withFallback(input.description, DEFAULT_PILLARS.description),
    items,
  };
};

const buildContact = (input: ContactSectionInput): FrontpageContact => ({
  _type: 'contactSection',
  title: withFallback(input.title, DEFAULT_CONTACT.title),
  lead: withFallback(input.lead, DEFAULT_CONTACT.lead),
  email: withFallback(input.email, DEFAULT_CONTACT.email),
  note: withFallback(input.note, DEFAULT_CONTACT.note),
});

const resolveCta = (
  value: SanityCtaInput | undefined,
  fallback: Cta,
): Cta => {
  const label = value?.label?.trim();
  const href = value?.href?.trim();

  if (!label || !href) {
    return fallback;
  }

  return {label, href};
};

const withFallback = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};
