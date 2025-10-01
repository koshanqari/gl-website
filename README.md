# Golden Lotus - Corporate Event Planning Website

A modern, responsive website for Golden Lotus, India's leading MICE and Experience Marketing Agency.

## Features

- **Responsive Design**: Mobile-first approach with hamburger menu for mobile devices
- **Modern UI**: Built with Tailwind CSS and custom design system based on Figma
- **Interactive Components**: Carousels, animated client logos, and smooth transitions
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Performance**: Built with Next.js 15 for optimal performance

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Fonts**: Montserrat, Source Sans Pro
- **Deployment**: Vercel (ready for deployment)

## Design System

The website uses a comprehensive design system based on the Figma specifications:

### Colors
- **Primary**: #B38700 (Golden)
- **Secondary**: #F4C430 (Yellow)
- **Accent**: #B68E12 (Dark Gold)
- **Text**: #000000 (Black), #F5F5F5 (Light Gray)
- **Backgrounds**: #FFFFFF (White), #FAF7ED (Cream), #5D490D (Dark)

### Typography
- **Display Large**: 64px, Montserrat, 600 weight
- **Display Medium**: 56px, Montserrat, 600 weight
- **Display Small**: 44px, Montserrat, 600 weight
- **Body Large**: 18px, Source Sans Pro, 400 weight
- **Body Medium**: 14px, Source Sans Pro, 400 weight
- **Body Small**: 12px, Source Sans Pro, 400 weight

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── QuickIntroSection.tsx
│   │   ├── ClientsSection.tsx
│   │   ├── ShowcaseSection.tsx
│   │   ├── CredibilitySection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── CTASection.tsx
│   └── ui/
│       └── Button.tsx
├── lib/
│   └── utils.ts
└── types/
```

## Homepage Sections

1. **Hero Section**: Full-width background with tagline and CTA buttons
2. **Quick Intro**: Company description and "Learn More" button
3. **Clients**: Animated scrolling strip of client logos
4. **Showcase**: Carousel of past events with navigation
5. **Credibility**: Stats grid showing company achievements
6. **Testimonials**: Client testimonials carousel
7. **CTA Section**: Final conversion section
8. **Footer**: Comprehensive footer with links, contact info, and GrowthJockey partnership

## Mobile Responsiveness

- Responsive navbar with hamburger menu
- Mobile-optimized carousels and grids
- Touch-friendly navigation
- Optimized typography for mobile screens

## Future Enhancements

- Contact form functionality
- Blog management system
- Work portfolio management
- Admin dashboard
- SEO optimization
- Analytics integration

## Deployment

The project is ready for deployment on Vercel:

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically

## License

Private project for Golden Lotus Event Management.
