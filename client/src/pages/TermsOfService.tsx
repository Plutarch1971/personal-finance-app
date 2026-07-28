//TermsOfService.tsx
import { Link } from "react-router-dom";
const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By creating an account or using SmartBooks Finance, you agree to these Terms of Service.",
      "If you do not agree, you must discontinue use of the service.",
    ],
  },
  {
    title: "2. Description of Service",
    content: [
      "SmartBooks Finance provides software that helps users:",
      "• Track income",
      "• Track expenses",
      "• Manage budgets",
      "• Generate financial reports",
      "• Monitor personal finances",
      "SmartBooks Finance is an information management tool only.",
    ],
  },
  {
    title: "3. Not Financial Advice",
    content: [
      "SmartBooks Finance does not provide:",
      "• Financial advice",
      "• Investment advice",
      "• Accounting advice",
      "• Tax advice",
      "• Legal advice",
      "Users remain solely responsible for their financial decisions.",
    ],
  },
  {
    title: "4. User Accounts",
    content: [
      "You agree to:",
      "• Provide accurate information",
      "• Maintain password confidentiality",
      "• Notify us of unauthorized account use",
      "You are responsible for all activity occurring under your account.",
    ],
  },
  {
    title: "5. Subscription",
    content: [
      "Certain features require a paid subscription.",
      "Subscriptions are billed through Stripe.",
      "Subscription prices may change with advance notice.",
    ],
  },
  {
    title: "6. Trial Period",
    content: [
      "Eligible users may receive a 14-day free trial.",
      "At the end of the trial:",
      "• Access to subscription features may be restricted until a subscription is purchased.",
    ],
  },
  {
    title: "7. Payments",
    content: [
      "Subscription payments are processed securely through Stripe.",
      "SmartBooks Finance never stores payment card information.",
    ],
  },
  {
    title: "8. Cancellation",
    content: [
      "You may cancel your subscription at any time through the Stripe Customer Portal.",
      "Cancellation will take effect according to your current billing period.",
    ],
  },
  {
    title: "9. Refunds",
    content: [
      "Unless required by applicable law, subscription payments are non-refundable.",
      "Requests may be reviewed on a case-by-case basis.",
    ],
  },
  {
    title: "10. Acceptable Use",
    content: [
      "You agree not to:",
      "• Use the service unlawfully",
      "• Attempt unauthorized access",
      "• Interfere with system security",
      "• Upload malicious software",
      "• Reverse engineer the application",
    ],
  },
  {
    title: "11. Availability",
    content: [
      "We strive to provide reliable service but cannot guarantee uninterrupted availability.",
      "Maintenance, outages, or technical issues may occasionally affect service.",
    ],
  },
  {
    title: "12. Limitation of Liability",
    content: [
      "To the maximum extent permitted by law:",
      "SmartBooks Finance shall not be liable for:",
      "• Financial losses",
      "• Lost profits",
      "• Lost data",
      "• Business interruption",
      "• Indirect or consequential damages arising from the use or inability to use the service.",
    ],
  },
  {
    title: "13. Disclaimer",
    content: [
      'The service is provided "as is" without warranties of any kind, whether express or implied.',
    ],
  },
  {
    title: "14. Intellectual Property",
    content: [
      "All software, logos, branding, text, and designs remain the property of SmartBooks Finance.",
      "Users may not copy, modify, distribute, or resell any part of the application without written permission.",
    ],
  },
  {
    title: "15. Termination",
    content: [
      "We reserve the right to suspend or terminate accounts that violate these Terms of Service.",
    ],
  },
  {
    title: "16. Governing Law",
    content: [
      "These Terms shall be governed by the laws of the Province of Ontario and the applicable laws of Canada.",
    ],
  },
  {
    title: "17. Changes",
    content: [
      "We may revise these Terms from time to time.",
      "Continued use of the service after changes become effective constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "18. Contact",
    content: [
      "Questions regarding these Terms may be sent to:",
      "Email: support@smartbooksfinance.com",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-end mt-4">
        <Link to="/dashboard" className="btn btn-primary">
          Back
        </Link>
      </div>
      <div className="row justify-content-center">
        <div className="col-10 col-lg-8">
          <h1 className="fw-bold text-warning mb-2">Terms of Service</h1>
          <p className="mb-4 text-white">SmartBooks Finance Terms of Service</p>
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
