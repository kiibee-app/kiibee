This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SEO and analytics configuration

Production robots, sitemap, canonical links and metadata use `https://www.kiibee.dk`.
Local development can use `NEXT_PUBLIC_SITE_URL` or `SITE_URL`. Production ignores
stale staging URLs in those variables.

To enable analytics, create a GA4 web stream for `https://www.kiibee.dk` and set
`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...` in the web project's Vercel Production
environment, then redeploy. Keep GA4 Enhanced Measurement page views on browser
history changes enabled for client-side navigation. Without a valid ID, neither
the Google script nor the consent prompt loads. With an ID, visitors must opt in
before the script loads; Cookie Settings allows consent to be withdrawn.
Advertising and remarketing signals are disabled.

The wildcard allow rule in robots.txt includes search and AI crawlers. This does
not override Vercel/CDN firewall rules: verify crawler access and logs separately
in the hosting dashboard. A request with a crawler user-agent is only a smoke
test, not verification of the real crawler's IP-based access.
