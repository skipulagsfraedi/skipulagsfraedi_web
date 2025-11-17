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

type SiteSettingsImage = {
  asset: SanityImageAsset;
  alt?: string;
};

type SiteSettingsDocument = {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SiteSettingsImage;
  heroPrimaryCta?: SiteSettingsCta;
  heroSecondaryCta?: SiteSettingsCta;
  footerNotice?: string;
  footerEmail?: string;
};

type SiteSettingsCta = {
  label?: string;
  href?: string;
};

export type HeroCopy = {
  badge: string;
  title: string;
  subtitle: string;
  image?: SiteSettingsImage;
  primaryCta: Required<SiteSettingsCta>;
  secondaryCta: Required<SiteSettingsCta>;
};

export type FooterCopy = {
  notice: string;
  email: string;
};

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
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
  footerNotice,
  footerEmail
}`;

let cachedSettings: SiteSettingsDocument | null | undefined;
let settingsPromise: Promise<SiteSettingsDocument | null> | null;

const DEFAULT_HERO: HeroCopy = {
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

const DEFAULT_FOOTER: FooterCopy = {
  notice: 'Skipulagsfræðingafélag Íslands. Allur réttur áskilinn.',
  email: 'hallo@skipulagsfraedi.is',
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

export const getHomeHero = async (): Promise<HeroCopy> => {
  const settings = await getSiteSettings();

  if (!settings) {
    return DEFAULT_HERO;
  }

  return {
    badge: settings.heroBadge?.trim() || DEFAULT_HERO.badge,
    title: settings.heroTitle?.trim() || DEFAULT_HERO.title,
    subtitle: settings.heroSubtitle?.trim() || DEFAULT_HERO.subtitle,
    image: settings.heroImage || undefined,
    primaryCta: resolveCta(settings.heroPrimaryCta, DEFAULT_HERO.primaryCta),
    secondaryCta: resolveCta(settings.heroSecondaryCta, DEFAULT_HERO.secondaryCta),
  };
};

export const getSiteFooter = async (): Promise<FooterCopy> => {
  const settings = await getSiteSettings();

  if (!settings) {
    return DEFAULT_FOOTER;
  }

  return {
    notice: settings.footerNotice?.trim() || DEFAULT_FOOTER.notice,
    email: settings.footerEmail?.trim() || DEFAULT_FOOTER.email,
  };
};

const resolveCta = (
  value: SiteSettingsCta | undefined,
  fallback: Required<SiteSettingsCta>,
): Required<SiteSettingsCta> => {
  const label = value?.label?.trim();
  const href = value?.href?.trim();

  if (!label || !href) {
    return fallback;
  }

  return { label, href };
};

