# Skor AI

## Environment Variables *

To run this project, you need to set up the following environment variables:

```env
NEXTAUTH_SECRET="your_nextauth_secret_here"

AUTH_GOOGLE_ID=your_google_client_id_here
AUTH_GOOGLE_SECRET=your_google_client_secret_here

MONGODB_URI=your_mongodb_uri_here
NODE_ENV="development"

AUTH_FORWARDEMAIL_KEY=your_auth_forwardemail_key_here
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER_USER=your_email_server_user_here
EMAIL_SERVER_PASSWORD=your_email_server_password_here
EMAIL_SERVER_HOST=your_email_server_host_here
EMAIL_SERVER_PORT=your_email_server_port_here
EMAIL_FROM=your_email_from_here

NEXT_PUBLIC_OKTO_CLIENT_PRIVATE_KEY=your_okto_client_private_key_here
NEXT_PUBLIC_OKTO_CLIENT_SWA=your_okto_client_swa_here

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
NEXT_STRIPE_SECRET_KEY=your_stripe_secret_key_here

NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_STRIPE_INDIVIDUAL_PLAN_LINK=your_stripe_individual_plan_link_here
NEXT_STRIPE_PROFESSIONAL_PLAN_LINK=your_stripe_professional_plan_link_here
NEXT_STRIPE_ENTERPRISE_PLAN_LINK=your_stripe_enterprise_plan_link_here

NEXT_PUBLIC_STRIPE_INDIVIDUAL_PLAN_ID=your_stripe_individual_plan_id_here
NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_ID=your_stripe_professional_plan_id_here
NEXT_PUBLIC_STRIPE_ENTERPRISE_PLAN_ID=your_stripe_enterprise_plan_id_here
```

## Getting Started

To get started with the Skor Ai project, follow these steps:

1. Clone the repository:

   ```sh
   git clone
   ```

2. Navigate to the project directory:

   ```sh
   cd Skor-cs2
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Set up the environment variables by creating a `.env` file and adding the required variables.

5. Run the development server:

   ```sh
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.
