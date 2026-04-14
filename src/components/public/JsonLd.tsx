import React from 'react';

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "Pondok Pesantren Bali Bina Insani",
    "alternateName": "Bali Bina Insani Islamic Boarding School",
    "url": "https://project-98lnv.vercel.app",
    "logo": "https://project-98lnv.vercel.app/logo-bina-insani.png",
    "foundingDate": "1991",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Melati No.31, Desa Meliling, Kec. Kerambitan",
      "addressLocality": "Tabanan",
      "addressRegion": "Bali",
      "postalCode": "82161",
      "addressCountry": "ID"
    },
    "description": "Lembaga pendidikan Islam terpadu yang memadukan kurikulum nasional dan kepesantrenan dengan fokus pada Tahfidz Al-Qur'an dan karakter Islami.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-812-3456-7890",
      "contactType": "Admissions",
      "areaServed": "ID",
      "availableLanguage": ["Indonesian", "Arabic", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/balibinainsani",
      "https://www.instagram.com/balibinainsani",
      "https://www.youtube.com/@balibinainsani"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
