import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ 
  title = 'Dina Public School | Paharpur',
  description = 'Dina Public School Paharpur - Top WBBSE affiliated Bengali Medium school in Banshihari, Dakshin Dinajpur offering quality education and holistic development for students.',
  keywords = 'Dina Public School, Best School in Paharpur, Best School in Banshihari, Best School in Dakshin Dinajpur, WBBSE School, Bengali Medium School, Top School in South Dinajpur, Quality Education, School Admission, Paharpur Education',
  canonical = 'https://dpspaharpur.web.app',
  ogType = 'website',
  ogTitle = 'Dina Public School Paharpur | Top WBBSE School in Banshihari',
  ogDescription = 'Best WBBSE affiliated Bengali Medium school in Banshihari, Dakshin Dinajpur offering quality education, modern facilities, and holistic development for students.',
  ogImage = 'https://dpspaharpur.web.app/images/og-image.jpg',
  ogUrl = 'https://dpspaharpur.web.app',
  twitterCard = 'summary_large_image',
  children
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dina Public School" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Dina Public School Paharpur" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={ogUrl} />

      {/* Additional children elements */}
      {children}
    </Helmet>
  );
};

export default Seo;
