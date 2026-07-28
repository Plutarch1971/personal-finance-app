//PrivacyPolicy.tsx
import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Introduction",
    content: [
      'Welcome to SmartBooks Finance ("SmartBooks Finance", "we", "our", or "us").',
      "We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.",
      "By using SmartBooks Finance, you agree to this Privacy Policy.",
    ],
  },
  {
    title: "2. Information We Collect",
    content: [
      "We may collect the following information:",
      "Account Information",
      "• Name or username",
      "• Email address",
      "• Encrypted password",
      "• Account creation date",
      "Financial Information",
      "Information you voluntarily enter, including:",
      "• Accounts",
      "• Income",
      "• Expenses",
      "• Categories",
      "• Budgets",
      "• Transactions",
      "• Financial reports",
      "Subscription Information",
      "When purchasing a subscription:",
      "• Stripe Customer ID",
      "• Subscription ID",
      "• Subscription status",
      "We do not store your credit card number or payment details. All payment information is securely processed by Stripe.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: [
      "We use your information to:",
      "• Create your account",
      "• Authenticate users",
      "• Provide budgeting tools",
      "• Generate financial reports",
      "• Process subscriptions",
      "• Improve the application",
      "• Provide customer support",
      "• Prevent fraud and misuse",
    ],
  },
  {
    title: "4. Payment Processing",
    content: [
      "Payments are securely processed by Stripe.",
      "SmartBooks Finance never stores:",
      "• Credit card numbers",
      "• Security codes (CVV)",
      "• Bank account credentials",
      "Please review Stripe's Privacy Policy for information about how they process payment data.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "We implement reasonable technical and organizational safeguards, including:",
      "• Password encryption",
      "• HTTPS encryption",
      "• Secure authentication",
      "• Restricted database access",
      "While we strive to protect your information, no method of electronic storage or transmission is completely secure.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "We retain your account information while your account remains active.",
      "If you request account deletion, we will delete or anonymize your personal information unless retention is required by law.",
    ],
  },
  {
    title: "7. Cookies",
    content: [
      "We may use cookies and similar technologies to:",
      "• Maintain login sessions",
      "• Improve user experience",
      "• Analyze application performance",
      "You may disable cookies in your browser, although some features may not function correctly.",
    ],
  },
  {
    title: "8. Third-Party Services",
    content: [
      "We use trusted third-party providers, including:",
      "• Stripe (payment processing)",
      "• Render (application hosting)",
      "• Neon (database hosting)",
      "These providers maintain their own privacy policies.",
    ],
  },
  {
    title: "9. Your Rights",
    content: [
      "Depending on your location, you may have the right to:",
      "• Access your personal data",
      "• Correct inaccurate information",
      "• Request deletion of your account",
      "• Withdraw consent where applicable",
    ],
  },
  {
    title: "10. Children's Privacy",
    content: [
      "SmartBooks Finance is not intended for individuals under the age of 18.",
    ],
  },
  {
    title: "11. Changes to this Policy",
    content: [
      "We may update this Privacy Policy periodically.",
      "Material changes will be communicated through the application or website.",
    ],
  },
  {
    title: "12. Contact",
    content: [
      "Questions regarding this Privacy Policy may be directed to:",
      "Email: support@smartbooksfinance.com",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-end mt-4">
        <Link to="/dashboard" className="btn btn-primary">
          Back
        </Link>
      </div>
      <div className="row justify-content-center text-white">
        <div className="col-12 col-lg-8">
          <h1 className="fw-bold text-warning mb-2">Privacy Policy</h1>
          <p className="mb-4">SmartBooks Finance Privacy Policy</p>
          <p className="mb-4">
            <strong>Effective Date:</strong> July 27, 2026
          </p>

          {sections.map((section) => (
            <section key={section.title} className="mb-4">
              <h2 className="h5 fw-bold mb-3">{section.title}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
