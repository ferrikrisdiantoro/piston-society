import type { Car } from '@/lib/types/database'
import { formatCurrency } from './format'

const BASE_URL = 'https://www.pistonsociety.com.au'
const SITE_NAME = 'Piston Society'

export function generateCarMetadata(car: Car) {
  const yearPrefix = car.year ? `${car.year} ` : ''
  const title = `${yearPrefix}${car.make} ${car.model}${car.badge ? ` ${car.badge}` : ''} — From ${formatCurrency(car.price_weekly)}/week`
  const description = `Rent the ${yearPrefix}${car.make} ${car.model} from just ${formatCurrency(car.price_weekly)}/week. All-inclusive: registration, insurance, CTP, servicing & roadside assist. Available in ${car.location ?? 'Australia'}.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${BASE_URL}/cars/${car.id}`,
      siteName: SITE_NAME,
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  }
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+61-422-663-888',
      contactType: 'customer service',
      areaServed: 'AU',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://instagram.com/pistonsociety',
      'https://facebook.com/pistonsociety',
      'https://tiktok.com/@pistonsociety',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AU',
    },
  }
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/cars?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateCarJsonLd(car: Car, primaryImageUrl?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.year ? `${car.year} ` : ''}${car.make} ${car.model}${car.badge ? ` ${car.badge}` : ''}`,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    modelDate: car.year?.toString(),
    bodyType: car.body_type,
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    seatingCapacity: car.seats,
    driveWheelConfiguration: car.drivetrain ?? undefined,
    color: car.colour ?? undefined,
    offers: {
      '@type': 'Offer',
      price: car.price_weekly,
      priceCurrency: 'AUD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: car.price_weekly,
        priceCurrency: 'AUD',
        unitText: 'WK',
      },
      availability: car.is_available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      areaServed: {
        '@type': 'Country',
        name: 'Australia',
      },
    },
    image: primaryImageUrl ? [primaryImageUrl] : [],
    url: `${BASE_URL}/cars/${car.id}`,
  }
}

export function generateFAQJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
