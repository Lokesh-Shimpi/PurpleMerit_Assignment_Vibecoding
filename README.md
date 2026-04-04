# VibeKit Studio - Full Stack Vibe Coder Intern Assessment

VibeKit Studio is a polished web app that allows users to generate a design theme, apply it to a mini-site via a page builder, and publish it to a live, responsive URL.

## 🚀 Live Deployment
- **Deployed URL:** (https://vibekit-studios.netlify.app/)

## 🔐 Test User Credentials
You can create a new account, or use this pre-configured test account:
- **Email:** test@vibekit.com
- **Password:** 12345678

## 🛠️ Local Setup Instructions
1. Clone the repository: `git clone [your-repo-link]`
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add the required environment variables.
4. Run the development server: `npm run dev` (or `netlify dev` to test serverless functions locally).

## 🔑 Environment Variables Required
To run this project locally, you will need the following in your `.env` file:
- `MONGODB_URI=` (Your MongoDB connection string)
- `JWT_SECRET=` (Your secret key for authentication)

## ⚖️ Tradeoffs & Future Improvements
1. **Database Connection Pooling:** Due to the stateless nature of serverless functions, I implemented basic connection caching, but moving to a dedicated connection pooler or edge database would improve cold start times.
2. **State Management:** Used React Context for MVP simplicity. If scaling, I would introduce Zustand or Redux for more granular control over the page builder state to prevent unnecessary re-renders.
3. **Media Storage:** Currently accepting image URLs. Next step would be integrating AWS S3 or Cloudinary for direct image uploads.
4. **Theming Engine:** CSS variables work great, but adding a dynamic theme compiler (like processing custom user colors into a Tailwind config on the fly) would offer infinite variations instead of presets.
5. **Analytics:** View counts are currently a simple increment in MongoDB. I would upgrade this to a time-series database or Redis cache to handle high-traffic bursts on published pages.
