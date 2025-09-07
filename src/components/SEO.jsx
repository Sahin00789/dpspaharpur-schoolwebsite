import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ 
  title = 'Delhi Public School, Paharpur | Best CBSE School in Paharpur, Bihar',
  description = 'Delhi Public School, Paharpur is a premier educational institution offering quality education with modern facilities and experienced faculty in Paharpur, Bihar.',
  keywords = 'DPS Paharpur, CBSE School, Best School in Paharpur, Top School in Bihar, Education, School Admission, Paharpur Schools, Best CBSE School in Bihar',
  canonical = '',
  ogType = 'website',
  ogImage = 'https://dpspaharpur.web.app/images/og-image.jpg',
  ogImageAlt = 'Delhi Public School, Paharpur - Premier Educational Institution',
  twitterCard = 'summary_large_image',
  twitterSite = '@dpspaharpur',
  twitterCreator = '@dpspaharpur',
  locale = 'en_IN',
  structuredData = {},
  noIndex = false,
  noFollow = false,
  themeColor = '#1a365d'
}) => {
  const siteName = 'Delhi Public School, Paharpur';
  const siteUrl = 'https://dpspaharpur.web.app';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].filter(Boolean).join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullCanonical} />
      <meta name="theme-color" content={themeColor} />
      <meta name="author" content="Delhi Public School, Paharpur" />
      <meta name="publisher" content="Delhi Public School, Paharpur" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      {/* Additional Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="application-name" content={siteName} />
      
      {/* Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={themeColor} />
      
      {/* Structured Data */}
      {Object.keys(structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            ...structuredData,
            '@type': structuredData['@type'] || 'WebPage',
            url: fullCanonical,
            name: title,
            description: description,
            publisher: {
              '@type': 'Organization',
              name: siteName,
              url: siteUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
                width: '600',
                height: '60'
              }
            },
            image: ogImage ? {
              '@type': 'ImageObject',
              url: ogImage,
              width: '1200',
              height: '630',
              alt: ogImageAlt
            } : undefined
          })}
        </script>
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonical: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  ogImageAlt: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterSite: PropTypes.string,
  twitterCreator: PropTypes.string,
  locale: PropTypes.string,
  structuredData: PropTypes.object,
  noIndex: PropTypes.bool,
  noFollow: PropTypes.bool,
  themeColor: PropTypes.string
};

SEO.defaultProps = {
  title: 'Delhi Public School, Paharpur | Best CBSE School in Paharpur, Bihar',
  description: 'Delhi Public School, Paharpur is a premier educational institution offering quality education with modern facilities and experienced faculty in Paharpur, Bihar.',
  keywords: 'DPS Paharpur, CBSE School, Best School in Paharpur, Top School in Bihar, Education, School Admission, Paharpur Schools, Best CBSE School in Bihar',
  ogImage: 'https://dpspaharpur.web.app/images/og-image.jpg',
  ogImageAlt: 'Delhi Public School, Paharpur - Premier Educational Institution',
  twitterCard: 'summary_large_image',
  twitterSite: '@dpspaharpur',
  twitterCreator: '@dpspaharpur',
  locale: 'en_IN',
  noIndex: false,
  noFollow: false,
  themeColor: '#1a365d'
};

export default SEO;
