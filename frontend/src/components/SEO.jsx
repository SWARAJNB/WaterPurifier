import { useEffect } from 'react';

/**
 * SEO Component — Dynamically sets <head> meta tags for each page.
 * Supports: title, description, keywords, Open Graph, Twitter Cards, canonical URL, and JSON-LD structured data.
 */
export default function SEO({
    title,
    description,
    keywords,
    image = '/og-image.jpg',
    url,
    type = 'website',
    structuredData = null,
}) {
    const siteName = 'AquaPure';
    const baseUrl = 'https://aquapure.com'; // REPLACE with your actual domain
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Premium Water Purifiers`;
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
    const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    useEffect(() => {
        // Title
        document.title = fullTitle;

        // Helper to set or create meta tags
        const setMeta = (attr, key, content) => {
            let el = document.querySelector(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Standard Meta
        if (description) setMeta('name', 'description', description);
        if (keywords) setMeta('name', 'keywords', keywords);

        // Open Graph
        setMeta('property', 'og:title', fullTitle);
        if (description) setMeta('property', 'og:description', description);
        setMeta('property', 'og:image', fullImage);
        setMeta('property', 'og:url', fullUrl);
        setMeta('property', 'og:type', type);
        setMeta('property', 'og:site_name', siteName);
        setMeta('property', 'og:locale', 'en_IN');

        // Twitter Card
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', fullTitle);
        if (description) setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', fullImage);

        // Canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', fullUrl);

        // JSON-LD Structured Data
        const existingLd = document.getElementById('page-structured-data');
        if (existingLd) existingLd.remove();

        if (structuredData) {
            const script = document.createElement('script');
            script.id = 'page-structured-data';
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }

        // Cleanup
        return () => {
            const ld = document.getElementById('page-structured-data');
            if (ld) ld.remove();
        };
    }, [fullTitle, description, keywords, fullImage, fullUrl, type, structuredData]);

    return null; // This component renders nothing — it only modifies <head>
}
