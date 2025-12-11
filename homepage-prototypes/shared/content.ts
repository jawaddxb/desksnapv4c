/**
 * Shared Content for Homepage Prototypes
 *
 * All copy extracted from the existing landing page.
 * Each prototype variation uses this same content but with different styling.
 */

export const HOMEPAGE_CONTENT = {
  brand: {
    name: 'DeckSnap',
    tagline: 'Presentations with Character',
    logoLetter: 'D',
    description: 'AI-powered slide design inspired by Wabi-Sabi philosophy.',
  },

  hero: {
    badge: 'AI-Powered Presentations',
    headline: 'Presentations with Character',
    subheadline: 'AI-powered slide design inspired by Wabi-Sabi philosophy. Create distinctive decks that move audiences—not just impress them.',
    primaryCTA: 'Start Creating Free',
    secondaryCTA: 'See How It Works',
    socialProof: {
      label: 'Trusted by creators at',
      companies: ['Stanford', 'RISD', 'Figma', 'Linear', 'Notion'],
    },
    stats: {
      archetypes: '60+',
      archetypesLabel: 'Unique Archetypes',
    },
  },

  features: {
    sectionLabel: 'Why DeckSnap',
    headline: 'AI That Gets It',
    subheadline: 'Not another template gallery. A creative partner that understands what makes presentations actually work.',
    items: [
      {
        iconName: 'Sparkles',
        headline: "Describe, Don't Design",
        copy: 'Tell us your topic. Our AI understands context, not just keywords—creating slides that actually make sense together.',
        benefit: 'Go from blank page to complete deck in under 5 minutes.',
      },
      {
        iconName: 'Palette',
        headline: 'Find Your Visual Voice',
        copy: 'From Kintsugi gold to Bauhaus geometry, from Tokyo neon to Nordic calm. Not templates—design systems that adapt to your content.',
        benefit: 'Stand out in a sea of identical slides.',
      },
      {
        iconName: 'Image',
        headline: 'No More Stock Photo Hunting',
        copy: 'Every slide gets custom visuals generated to match your theme. Cohesive. Distinctive. Yours.',
        benefit: 'Spend zero time on image search.',
      },
      {
        iconName: 'RefreshCw',
        headline: 'Refine With Confidence',
        copy: 'Remix layouts, adjust tone, regenerate images—all without starting over. Your presentation evolves as your thinking does.',
        benefit: 'Permission to ship early and improve often.',
      },
    ],
  },

  howItWorks: {
    sectionLabel: 'How It Works',
    headline: 'Three Steps to Beautiful',
    subheadline: 'No design skills required. No learning curve. Just describe what you need.',
    steps: [
      {
        number: '01',
        iconName: 'MessageSquare',
        title: 'Describe Your Idea',
        description: 'Start with a topic, a rough outline, or even just a question. Our AI handles the structure.',
      },
      {
        number: '02',
        iconName: 'Layers',
        title: 'Choose Your Character',
        description: "Select from 60+ visual archetypes. Each one is a complete design system—not a template you'll fight with.",
      },
      {
        number: '03',
        iconName: 'Send',
        title: 'Refine & Present',
        description: 'Edit content, adjust layouts, regenerate visuals. When it feels right, present or export.',
      },
    ],
  },

  testimonials: {
    sectionLabel: 'Testimonials',
    headline: 'Loved by Creators',
    subheadline: "Join thousands of designers, educators, and founders who've discovered a better way to present.",
    items: [
      {
        quote: "DeckSnap gave me permission to stop obsessing over pixel perfection. My presentations are better because they're more honest.",
        author: 'Sarah Chen',
        role: 'Product Designer',
        company: 'TechStartup',
      },
      {
        quote: 'My students actually engage with my slides now. The Wabi-Sabi aesthetic invites discussion instead of passive consumption.',
        author: 'Dr. Marcus Rodriguez',
        role: 'Professor of Design',
        company: 'RISD',
      },
      {
        quote: 'We closed our Series A with a DeckSnap presentation. Investors said it looked "refreshingly authentic."',
        author: 'Priya Sharma',
        role: 'Founder',
        company: 'SeedStage',
      },
    ],
  },

  cta: {
    badge: 'No credit card required',
    headline: 'Your Ideas Are Ready.',
    headlineAccent: 'Let Them Out.',
    subheadline: 'Stop perfecting. Start presenting. Create your first deck in minutes—for free.',
    buttonText: 'Create Your First Deck — Free',
    tagline: '"Done beats perfect. Always."',
  },

  footer: {
    tagline: 'Presentations with character. AI-powered slide design inspired by Wabi-Sabi philosophy.',
    copyright: `© ${new Date().getFullYear()} DeckSnap. All rights reserved.`,
    bottomTagline: '"Presentations with character."',
    links: {
      product: [
        { label: 'Features', href: '/features' },
        { label: 'Themes Gallery', href: '/themes' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Changelog', href: '#', disabled: true },
      ],
      solutions: [
        { label: 'For Startups', href: '/solutions/startups' },
        { label: 'For Educators', href: '/solutions/educators' },
        { label: 'For Designers', href: '/solutions/designers' },
        { label: 'For Teams', href: '/solutions/teams' },
      ],
      resources: [
        { label: 'Blog', href: '#', disabled: true },
        { label: 'Help Center', href: '#', disabled: true },
        { label: 'API Docs', href: '#', disabled: true },
      ],
      company: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '#', disabled: true },
        { label: 'Privacy Policy', href: '#', disabled: true },
        { label: 'Terms of Service', href: '#', disabled: true },
      ],
    },
    social: [
      { name: 'Twitter', href: '#' },
      { name: 'LinkedIn', href: '#' },
      { name: 'GitHub', href: '#' },
    ],
  },
};

export type HomepageContent = typeof HOMEPAGE_CONTENT;
