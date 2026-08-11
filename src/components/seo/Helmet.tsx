import React, { useEffect } from 'react';

export interface HelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
  children?: React.ReactNode;
}

const DEFAULT_TITLE = 'ARMA Rwanda | African Rwanda Modeling Association';
const DEFAULT_DESCRIPTION =
  'Official national platform for models, modeling agencies, scouts, fashion event casting call management, digital licensing certification, and talent verification in Rwanda.';
const DEFAULT_KEYWORDS =
  'ARMA Rwanda, Rwanda Modeling Association, Kigali Models, African Models, Runway Castings, Modeling Agency License, Kigali Fashion Week, Fashion Industry Rwanda';
const DEFAULT_AUTHOR = 'African Rwanda Modeling Association (ARMA Secretariat)';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';

export const Helmet: React.FC<HelmetProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  author = DEFAULT_AUTHOR,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonical,
  children,
}) => {
  useEffect(() => {
    // 1. Dynamic Document Title
    const fullTitle = title
      ? title.includes('ARMA')
        ? title
        : `${title} | ARMA Rwanda`
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to insert or update meta tags
    const updateMetaTag = (attribute: 'name' | 'property', attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to insert or update link rel canonical
    const updateCanonical = (hrefValue?: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (hrefValue) {
        if (!link) {
          link = document.createElement('link');
          link.setAttribute('rel', 'canonical');
          document.head.appendChild(link);
        }
        link.setAttribute('href', hrefValue);
      } else if (link) {
        link.remove();
      }
    };

    // Standard SEO Meta Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'author', author);
    updateMetaTag('name', 'robots', 'index, follow');
    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp, etc.)
    updateMetaTag('property', 'og:title', ogTitle || fullTitle);
    updateMetaTag('property', 'og:description', ogDescription || description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);
    if (ogUrl || typeof window !== 'undefined') {
      updateMetaTag('property', 'og:url', ogUrl || window.location.href);
    }

    // Twitter Card Meta Tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', ogTitle || fullTitle);
    updateMetaTag('name', 'twitter:description', ogDescription || description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // Canonical Link Tag
    updateCanonical(canonical || (typeof window !== 'undefined' ? window.location.href : undefined));

  }, [title, description, keywords, author, ogTitle, ogDescription, ogImage, ogType, ogUrl, twitterCard, canonical]);

  return <>{children}</>;
};
