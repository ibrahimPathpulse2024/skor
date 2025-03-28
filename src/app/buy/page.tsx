import { CheckIcon } from "lucide-react";
import Link from "next/link";
import Header from "../../components/header";

interface Plan {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  includesText: string;
  buttonColor: string;
  hoverColor: string;
  paymentLink: string;
  paymentId: string;
}

export default function SubscriptionPage() {
  const plans: Plan[] = [
    {
      title: "Individual",
      subtitle: "Perfect for casual gamers",
      price: "10",
      features: [
        "Basic AI assistance",
        "5 games supported",
        "Standard response time",
        "Email support",
      ],
      includesText: "Includes:",
      buttonColor: "bg-orange-600",
      hoverColor: "hover:bg-orange-500",
      paymentLink: process.env.NEXT_STRIPE_INDIVIDUAL_PLAN_LINK,
      paymentId: process.env.NEXT_PUBLIC_STRIPE_INDIVIDUAL_PLAN_ID,
    },
    {
      title: "Professional",
      subtitle: "For serious gamers",
      price: "30",
      features: [
        "Advanced AI strategies",
        "20 games supported",
        "Faster response time",
        "Priority email support",
        "Performance analytics",
        "Custom game settings",
      ],
      isPopular: true,
      includesText: "Everything in Individual, plus:",
      buttonColor: "bg-orange-500",
      hoverColor: "hover:bg-orange-400",
      paymentLink: process.env.NEXT_STRIPE_PROFESSIONAL_PLAN_LINK,
      paymentId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PLAN_ID,
    },
    {
      title: "Enterprise",
      subtitle: "For professional teams",
      price: "50",
      features: [
        "Elite AI algorithms",
        "All games supported",
        "Real-time responses",
        "24/7 dedicated support",
        "Team collaboration features",
        "Custom AI training",
        "API access",
        "White-label options",
      ],
      includesText: "Everything in Professional, plus:",
      buttonColor: "bg-orange-600",
      hoverColor: "hover:bg-orange-500",
      paymentLink: process.env.NEXT_STRIPE_ENTERPRISE_PLAN_LINK,
      paymentId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PLAN_ID,
    },
  ];

  return (
    <section className="w-full overflow-hidden">
      <div>
        <div
          className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.svg')" }}
        >
          <div>
            <Header />
          </div>
          <div className="min-h-screen  text-white">
            {/* Header */}
            <header className="pt-16 pb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Skor<span className="text-orange-500">AI</span> Gaming Agent
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Supercharge your gaming experience with our advanced AI agent.
                Choose the plan that works best for you.
              </p>
            </header>

            {/* Subscription Cards */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
              <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.title}
                    className={`bg-zinc-900 rounded-xl p-8 border ${
                      plan.isPopular
                        ? "border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                        : "border-zinc-800 hover:border-orange-500/50"
                    } transition-all duration-300 flex flex-col h-full relative`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black text-xs font-bold py-1 px-4 rounded-full">
                        MOST POPULAR
                      </div>
                    )}

                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-2">
                        {plan.title}
                      </h2>
                      <p className="text-zinc-400 text-sm mb-6">
                        {plan.subtitle}
                      </p>
                      <div className="flex items-end mb-6">
                        <span className="text-4xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-zinc-400 ml-2">/month</span>
                      </div>
                      <Link
                        href={plan.paymentLink || "#"}
                        className={`block w-full py-3 px-4 ${plan.buttonColor} ${plan.hoverColor} text-center rounded-lg font-medium transition-colors duration-200`}
                      >
                        Get Started
                      </Link>
                    </div>

                    <div className="mt-auto">
                      <p className="text-sm font-medium text-zinc-400 mb-4">
                        {plan.includesText}
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-orange-500 mr-2 shrink-0" />
                            <span className="text-sm text-zinc-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ or additional info */}
              <div className="mt-20 text-center">
                <p className="text-zinc-400">
                  Have questions?{" "}
                  <Link
                    href="#"
                    className="text-orange-500 hover:text-orange-400 underline"
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
