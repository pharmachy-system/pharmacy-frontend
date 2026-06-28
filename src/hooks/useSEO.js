/**
 * useSEO — set document title and meta tags without react-helmet
 */
import { useEffect } from 'react';

const SITE_NAME = 'صيدلية الأنصار';

export default function useSEO({ title, description, canonical } = {}) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${SITE_NAME}`;
    }
  }, [title]);

  useEffect(() => {
    if (!description) return;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [description]);

  useEffect(() => {
    if (!canonical) return;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [canonical]);
}
