import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], 
    },
    sitemap: 'https://post-applicaiton-with-nextjs-babonbo.vercel.app/sitemap.xml',
  }
} 