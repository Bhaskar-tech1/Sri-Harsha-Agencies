# Sri Harsha Agencies storefront

Customer-facing storefront and admin catalog manager built with Next.js App Router, JavaScript, React, Tailwind CSS, Swiper, AOS, Firebase Firestore and Cloudinary.

## Run locally

```bash
npm install
npm run dev
```

The available checks are `npm run lint` and `npm run build`.

## Store configuration

Edit [`src/config/site.js`](src/config/site.js) to set the business WhatsApp number, phone, email, address, social links and announcement. Use the WhatsApp number with country code and digits only, for example `919876543210`.

Product and combo examples, including demo prices and editable image sources, are centralized in [`src/data/products.js`](src/data/products.js). Category names and URL slugs live in [`src/data/categories.js`](src/data/categories.js). Replace the sample prices and the clearly labelled sample feedback before using the catalogue as a live offer.

The original logo is served from `public/images/sri-harsha-logo.png`. Product and food photography currently uses Unsplash-hosted images; `next.config.js` permits that image host. Local assets can replace those URLs in the central data files when supplied.

The cart is stored in browser localStorage. Enquiry and cart actions prepare a WhatsApp message for the customer to review and send; no backend or order submission service is connected in Phase 1.
