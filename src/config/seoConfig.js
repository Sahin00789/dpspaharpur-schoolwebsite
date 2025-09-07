// Default SEO configuration
export const defaultSEO = {
  title: 'Delhi Public School, Paharpur | Best CBSE School in Paharpur',
  description: 'Delhi Public School, Paharpur is a premier educational institution offering quality education with modern facilities and experienced faculty.',
  keywords: 'DPS Paharpur, CBSE School, Best School in Paharpur, Education, School Admission',
  siteUrl: 'https://dpspaharpur.com',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@dpspaharpur',
};

// School structured data for schema.org
export const schoolStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Delhi Public School, Paharpur',
  url: 'https://dpspaharpur.com',
  logo: 'https://dpspaharpur.com/logo.png',
  sameAs: [
    'https://facebook.com/dpspaharpur',
    'https://twitter.com/dpspaharpur',
    'https://instagram.com/dpspaharpur',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'Admissions',
    email: 'admissions@dpspaharpur.com',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Paharpur',
    addressLocality: 'Paharpur',
    addressRegion: 'Bihar',
    postalCode: 'XXXXXXXX',
    addressCountry: 'IN',
  },
};

// Home page SEO configuration
export const homeSEO = {
  title: 'Home | Delhi Public School, Paharpur',
  description: 'Welcome to Delhi Public School, Paharpur - Nurturing young minds with excellence in education since [year].',
  structuredData: {
    ...schoolStructuredData,
    '@type': 'WebPage',
    name: 'Home',
    description: 'Official website of Delhi Public School, Paharpur',
  },
};

// Admission page SEO configuration
export const admissionSEO = {
  title: 'Admissions | Delhi Public School, Paharpur',
  description: 'Admission open for the academic year 2025-26. Apply now for quality education at DPS Paharpur.',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Admissions',
    description: 'Admission process and requirements for Delhi Public School, Paharpur',
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the admission requirements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Admission requirements include...',
          },
        },
        // Add more FAQs as needed
      ],
    },
  },
};

// About page SEO configuration
export const aboutSEO = {
  title: 'About Us | Delhi Public School, Paharpur',
  description: 'Learn about our history, mission, vision, and the values that make DPS Paharpur a leading educational institution.',
  structuredData: {
    ...schoolStructuredData,
    '@type': 'AboutPage',
    name: 'About Us',
    description: 'About Delhi Public School, Paharpur - Our mission, vision, and values',
  },
};

// Contact page SEO configuration
export const contactSEO = {
  title: 'Contact Us | Delhi Public School, Paharpur',
  description: 'Get in touch with Delhi Public School, Paharpur for admissions, inquiries, and more.',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    description: 'Contact information for Delhi Public School, Paharpur',
  },
};
