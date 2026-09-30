import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'EDITOR']),
})

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(['ADMIN', 'EDITOR']).optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
})

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  canonical: z.string().optional(),
  indexable: z.boolean().optional(),
})

export const pageUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  visible: z.boolean().optional(),
  showInNavigation: z.boolean().optional(),
  indexable: z.boolean().optional(),
  title: z.string().optional(),
  metaDescription: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export const serviceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  heroImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  capabilities: z.array(z.object({ title: z.string(), description: z.string().optional() })).optional(),
  processSteps: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        order: z.number().optional(),
        hidden: z.boolean().optional(),
      }),
    )
    .optional(),
  seo: seoSchema.optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  displayOrder: z.number().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishAt: z.coerce.date().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export const caseStudySchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).optional(),
  client: z.string().optional(),
  industry: z.string().optional(),
  services: z.array(z.string()).optional(),
  challenge: z.string().optional(),
  approach: z.string().optional(),
  execution: z.string().optional(),
  outcome: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  video: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  publishAt: z.coerce.date().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
})

export const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  page: z.enum(['home', 'events', 'brand-activation', 'mice', 'online-marketing', 'other']),
  service: z.string().optional(),
  order: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
})

const sectionConfig = z.object({ enabled: z.boolean().optional(), order: z.number().optional() })

export const eventSchema = z.object({
  name: z.string().min(1),
  internalName: z.string().optional(),
  slug: z.string().min(1).optional(),
  publicName: z.string().optional(),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  venue: z.string().optional(),
  city: z.string().optional(),
  eventDate: z.coerce.date().optional(),
  eventTime: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional(),
  landingPageEnabled: z.boolean().optional(),
  mainWebsiteEnabled: z.boolean().optional(),
  sections: z
    .object({
      hero: sectionConfig.optional(),
      eventDetails: sectionConfig.optional(),
      announcements: sectionConfig.optional(),
      gallery: sectionConfig.optional(),
      timeline: sectionConfig.optional(),
      cta: sectionConfig.optional(),
      leadForm: sectionConfig.optional(),
      faq: sectionConfig.optional(),
      footer: sectionConfig.optional(),
    })
    .optional(),
  leadForm: z
    .object({
      enabled: z.boolean().optional(),
      fields: z.array(z.enum(['name', 'email', 'phone'])).optional(),
      notificationEmail: z.string().email().optional().or(z.literal('')),
      successMessage: z.string().optional(),
    })
    .optional(),
  seo: seoSchema.optional(),
})

export const campaignPhaseSchema = z.object({
  name: z.string().min(1),
  internalDescription: z.string().optional(),
  publicHeadline: z.string().optional(),
  publicMessage: z.string().optional(),
  image: z.string().optional(),
  video: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED', 'ARCHIVED']).optional(),
  priority: z.number().optional(),
  showOnMainWebsite: z.boolean().optional(),
  showOnLandingPage: z.boolean().optional(),
})

export const leadSubmissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
})

export const navigationSchema = z.object({
  items: z.array(
    z.object({
      label: z.string(),
      to: z.string(),
      order: z.number().optional(),
      enabled: z.boolean().optional(),
      children: z
        .array(z.object({ label: z.string(), to: z.string(), order: z.number().optional(), enabled: z.boolean().optional() }))
        .optional(),
    }),
  ),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
})

export const siteSettingsSchema = z.object({
  siteTitle: z.string().optional(),
  defaultDescription: z.string().optional(),
  defaultOgImage: z.string().optional(),
  canonicalDomain: z.string().optional(),
  organizationName: z.string().optional(),
  organizationLogo: z.string().optional(),
  organizationAddress: z.string().optional(),
  organizationPhone: z.string().optional(),
  organizationEmail: z.string().optional(),
  socialLinks: z.object({ instagram: z.string().optional(), linkedin: z.string().optional() }).optional(),
})

export const announcementSchema = z.object({
  enabled: z.boolean().optional(),
  eventId: z.string().optional(),
  displayType: z.enum(['bar', 'modal']).optional(),
  headline: z.string().optional(),
  message: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  frequency: z.enum(['always', 'once-per-session', 'once-per-day']).optional(),
})

export const paginationQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
})
