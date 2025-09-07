import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ 
  title = 'Delhi Public School, Paharpur | Best CBSE School in Paharpur',
  description = 'Delhi Public School, Paharpur is a premier educational institution offering quality education with modern facilities and experienced faculty.',
  keywords = 'DPS Paharpur, CBSE School, Best School in Paharpur, Education, School Admission',
  canonical = '',
  ogType = 'website',
  ogImage = 'https://dpspaharpur.com/og-image.jpg',
  twitterCard = 'summary_large_image',
  structuredData = {}
}) => {
  const siteName = 'DPS Paharpur';
  const siteUrl = 'https://dpspaharpur.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {Object.keys(structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
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
  twitterCard: PropTypes.string,
  structuredData: PropTypes.object
};

export default SEO;
