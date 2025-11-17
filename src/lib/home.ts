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

type FrontpagePillarInput = {
  title?: string;
  description?: string;
};

type FrontpageContentDocument = {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImageWithAlt;
  heroPrimaryCta?: SanityCtaInput;
  heroSecondaryCta?: SanityCtaInput;
  newsBadge?: string;
  newsTitle?: string;
  newsDescription?: string;
  newsReadMoreLabel?: string;
  newsCta?: SanityCtaInput;
  teamTitle?: string;
  teamDescription?: string;
  pillarsBadge?: string;
  pillarsTitle?: string;
  pillarsDescription?: string;
  pillars?: FrontpagePillarInput[];
  contactTitle?: string;
  contactLead?: string;
  contactEmailLabel?: string;
  contactEmail?: string;
  contactNote?: string;
};

type SiteSettingsDocument = {
  footerNotice?: string;
  footerEmail?: string;
};

export type FrontpageHero = {
  badge: string;
  title: string;
  subtitle: string;
  image?: SanityImageWithAlt;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type FrontpageNews = {
  badge: string;
  title: string;
  description: string;
  readMoreLabel: string;
  cta: Cta;
};

export type FrontpageTeam = {
  title: string;
  description: string;
};

export type FrontpagePillarItem = {
  title: string;
  description: string;
};

export type FrontpagePillars = {
  badge: string;
  title: string;
  description: string;
  items: FrontpagePillarItem[];
};

export type FrontpageContact = {
  title: string;
  lead: string;
  emailLabel: string;
  email: string;
  note: string;
};

export type FrontpageContent = {
  hero: FrontpageHero;
  news: FrontpageNews;
  team: FrontpageTeam;
  pillars: FrontpagePillars;
  contact: FrontpageContact;
};

export type FooterCopy = {
  notice: string;
  email: string;
};

const FRONT_PAGE_QUERY = `*[_type == "frontpageContent"][0]{
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroImage {
    asset,
    alt
  },
  heroPrimaryCta {
    label,
    href
  },
  heroSecondaryCta {
    label,
    href
  },
  newsBadge,
  newsTitle,
  newsDescription,
  newsReadMoreLabel,
  newsCta {
    label,
    href
  },
  teamTitle,
  teamDescription,
  pillarsBadge,
  pillarsTitle,
  pillarsDescription,
  pillars[] {
    title,
    description
  },
  contactTitle,
  contactLead,
  contactEmailLabel,
  contactEmail,
  contactNote
}`;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  footerNotice,
  footerEmail
}`;

const DEFAULT_FRONT_PAGE: FrontpageContent = {
  hero: {
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
  },
  news: {
    badge: 'Fréttir',
    title: 'Nýjustu tíðindi úr starfseminni',
    description: 'Lestu um verkefni, viðburði og sjónarmið skipulagsfræðinga.',
    readMoreLabel: 'Lesa meira →',
    cta: {
      label: 'Sjá allar fréttir',
      href: '/frettir',
    },
  },
  team: {
    title: 'Teymið',
    description:
      'Við búum saman til leiðir sem byggja á rannsóknum, innblæstri og samtali við fólkið sem býr í hverfinu. Kynntu þér starfsfólkið og samstarfsaðila fljótlega hér.',
  },
  pillars: {
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
  },
  contact: {
    title: 'Hafðu samband',
    lead: 'Best er að senda okkur línu á',
    emailLabel: 'hallo@skipulagsfraedi.is',
    email: 'hallo@skipulagsfraedi.is',
    note: 'Við svarum fljótt og erum ávallt opin fyrir samtali um nýjar hugmyndir.',
  },
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

  return {
    hero: buildHero(doc),
    news: buildNews(doc),
    team: buildTeam(doc),
    pillars: buildPillars(doc),
    contact: buildContact(doc),
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

const buildHero = (doc: FrontpageContentDocument | null): FrontpageHero => ({
  badge: withFallback(doc?.heroBadge, DEFAULT_FRONT_PAGE.hero.badge),
  title: withFallback(doc?.heroTitle, DEFAULT_FRONT_PAGE.hero.title),
  subtitle: withFallback(doc?.heroSubtitle, DEFAULT_FRONT_PAGE.hero.subtitle),
  image: doc?.heroImage || undefined,
  primaryCta: resolveCta(doc?.heroPrimaryCta, DEFAULT_FRONT_PAGE.hero.primaryCta),
  secondaryCta: resolveCta(
    doc?.heroSecondaryCta,
    DEFAULT_FRONT_PAGE.hero.secondaryCta,
  ),
});

const buildNews = (doc: FrontpageContentDocument | null): FrontpageNews => ({
  badge: withFallback(doc?.newsBadge, DEFAULT_FRONT_PAGE.news.badge),
  title: withFallback(doc?.newsTitle, DEFAULT_FRONT_PAGE.news.title),
  description: withFallback(doc?.newsDescription, DEFAULT_FRONT_PAGE.news.description),
  readMoreLabel: withFallback(
    doc?.newsReadMoreLabel,
    DEFAULT_FRONT_PAGE.news.readMoreLabel,
  ),
  cta: resolveCta(doc?.newsCta, DEFAULT_FRONT_PAGE.news.cta),
});

const buildTeam = (doc: FrontpageContentDocument | null): FrontpageTeam => ({
  title: withFallback(doc?.teamTitle, DEFAULT_FRONT_PAGE.team.title),
  description: withFallback(doc?.teamDescription, DEFAULT_FRONT_PAGE.team.description),
});

const buildPillars = (doc: FrontpageContentDocument | null): FrontpagePillars => {
  const fallbackItems = DEFAULT_FRONT_PAGE.pillars.items;
  const docPillars = doc?.pillars;
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
    badge: withFallback(doc?.pillarsBadge, DEFAULT_FRONT_PAGE.pillars.badge),
    title: withFallback(doc?.pillarsTitle, DEFAULT_FRONT_PAGE.pillars.title),
    description: withFallback(
      doc?.pillarsDescription,
      DEFAULT_FRONT_PAGE.pillars.description,
    ),
    items,
  };
};

const buildContact = (doc: FrontpageContentDocument | null): FrontpageContact => ({
  title: withFallback(doc?.contactTitle, DEFAULT_FRONT_PAGE.contact.title),
  lead: withFallback(doc?.contactLead, DEFAULT_FRONT_PAGE.contact.lead),
  emailLabel: withFallback(
    doc?.contactEmailLabel,
    DEFAULT_FRONT_PAGE.contact.emailLabel,
  ),
  email: withFallback(doc?.contactEmail, DEFAULT_FRONT_PAGE.contact.email),
  note: withFallback(doc?.contactNote, DEFAULT_FRONT_PAGE.contact.note),
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
