// Default SEO configuration
export const defaultSEO = {
  title: 'Delhi Public School, Paharpur | Best CBSE School in Paharpur',
  description: 'Delhi Public School, Paharpur is a premier educational institution offering quality education with modern facilities and experienced faculty.',
  keywords: 'DPS Paharpur, CBSE School, Best School in Paharpur, Education, School Admission, Paharpur Schools, Top School in Bihar',
  siteUrl: 'https://dpspaharpur.web.app',
  ogImage: 'https://dpspaharpur.web.app/logo.png',
  twitterHandle: '@dpspaharpur',
  locale: 'en_IN',
  themeColor: '#1a365d',
  additionalMetaTags: [
    { name: 'author', content: 'Delhi Public School, Paharpur' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    { name: 'bingbot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
  ],
};

// School structured data for schema.org
export const schoolStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Delhi Public School, Paharpur',
  alternateName: 'DPS Paharpur',
  url: 'https://dpspaharpur.web.app',
  logo: 'https://dpspaharpur.web.app/logo.png',
  sameAs: [
    'https://facebook.com/dpspaharpur',
    'https://twitter.com/dpspaharpur',
    'https://instagram.com/dpspaharpur',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'Admissions',
    email: 'info@dpspaharpur.web.app',
    contactOption: 'TollFree',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Paharpur',
    addressLocality: 'Paharpur',
    addressRegion: 'west Bengal',
    postalCode: 'XXXXXXXX',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '25.3176',
    longitude: '85.2842',
  },
  openingHours: 'Mo-Fr 08:00-14:00',
  priceRange: '$$',
};

// Home page SEO configuration
export const homeSEO = {
  title: 'Home | Delhi Public School, Paharpur | Best CBSE School in Paharpur',
  description: 'Welcome to Delhi Public School, Paharpur - Nurturing young minds with excellence in education. Top-ranked CBSE school with modern facilities and experienced faculty.',
  canonical: 'https://dpspaharpur.web.app',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dpspaharpur.web.app',
    site_name: 'Delhi Public School, Paharpur',
    title: 'Delhi Public School, Paharpur | Best CBSE School in Paharpur',
    description: 'Premier educational institution offering quality education with modern facilities and experienced faculty in Paharpur, Bihar.',
    images: [
      {
        url: 'https://dpspaharpur.web.app/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Delhi Public School, Paharpur',
      },
    ],
  },
  twitter: {
    handle: '@dpspaharpur',
    site: '@dpspaharpur',
    cardType: 'summary_large_image',
  },
  structuredData: {
    ...schoolStructuredData,
    '@type': 'WebPage',
    name: 'Home',
    description: 'Official website of Delhi Public School, Paharpur',
    url: 'https://dpspaharpur.web.app',
  },
};

// Admission page SEO configuration
export const admissionSEO = {
  title: 'Admissions 2025-26 | Delhi Public School, Paharpur | Apply Now',
  description: 'Admission open for the academic year 2025-26. Apply now for quality education at DPS Paharpur. Limited seats available. Register today!',
  canonical: 'https://dpspaharpur.web.app/admission',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dpspaharpur.web.app/admission',
    site_name: 'Delhi Public School, Paharpur',
    title: 'Admissions 2025-26 | Delhi Public School, Paharpur',
    description: 'Admission process, fees structure, and requirements for Delhi Public School, Paharpur. Apply online for the academic year 2025-26.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Admissions',
    url: 'https://dpspaharpur.web.app/admission',
    description: 'Admission process and requirements for Delhi Public School, Paharpur',
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the admission requirements?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Admission requires submission of completed application form, birth certificate, previous school records, and transfer certificate (if applicable).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the admission process?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The admission process includes form submission, document verification, interaction with the admission committee, and fee payment upon selection.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the age criteria for admission?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For Nursery: 3+ years as on 31st March of the admission year. Please contact the admission office for specific age criteria for other classes.',
          },
        },
      ],
    },
  },
};

// About page SEO configuration
export const aboutSEO = {
  title: 'About Us | Delhi Public School, Paharpur | Our Story & Vision',
  description: 'Learn about our rich history, mission, vision, and the core values that make DPS Paharpur a leading educational institution in Bihar.',
  canonical: 'https://dpspaharpur.web.app/about',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dpspaharpur.web.app/about',
    site_name: 'Delhi Public School, Paharpur',
    title: 'About Us | Delhi Public School, Paharpur',
    description: 'Discover our journey, achievements, and commitment to excellence in education at Delhi Public School, Paharpur.',
  },
  structuredData: {
    ...schoolStructuredData,
    '@type': 'AboutPage',
    name: 'About Us',
    url: 'https://dpspaharpur.web.app/about',
    description: 'About Delhi Public School, Paharpur - Our mission, vision, values, and history',
  },
};

// Contact page SEO configuration
export const contactSEO = {
  title: 'Contact Us | Delhi Public School, Paharpur | Get in Touch',
  description: 'Get in touch with Delhi Public School, Paharpur for admissions, inquiries, and more. Visit us or contact us via phone/email.',
  canonical: 'https://dpspaharpur.web.app/contact',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dpspaharpur.web.app/contact',
    site_name: 'Delhi Public School, Paharpur',
    title: 'Contact Us | Delhi Public School, Paharpur',
    description: 'Contact information, location map, and inquiry form for Delhi Public School, Paharpur.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    url: 'https://dpspaharpur.web.app/contact',
    description: 'Contact information and inquiry form for Delhi Public School, Paharpur',
    address: schoolStructuredData.address,
    contactPoint: schoolStructuredData.contactPoint,
    geo: schoolStructuredData.geo,
    openingHours: schoolStructuredData.openingHours,
  },
};
