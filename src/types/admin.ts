export interface SiteSettings {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  footerLogoUrl: string;
  footerLogoWidth: number;
  footerLogoHeight: number;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  order: number;
  slug?: string;
  content?: string;
}

export interface FooterLinksData {
  legalLinks: FooterLink[];
}

export interface CaseStudy {
  id: string;
  imageUrl: string;
  imageAlt: string;
  tag: string;
  title: string;
  description: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  order: number;
}

export interface CasesData {
  cases: CaseStudy[];
}

export interface HubSpotConfig {
  accessToken: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export interface HubSpotBlogPost {
  id: string;
  slug: string;
  name: string;
  postBody: string;
  postSummary: string;
  featuredImage: string;
  publishDate: string;
  authorName: string;
  metaDescription: string;
}
