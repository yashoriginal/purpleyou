export const metadata = {
  title: "Privacy Policy | PURPLE YOU",
  description: "PURPLE YOU's commitment to protecting your personal data and privacy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8f5f2] border-b border-[#e6e0da]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wide mb-3">
            Privacy Policy
          </h1>
          <p className="text-base text-[#6b6b6b] font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose prose-sm max-w-none text-[#6b6b6b]">
          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4 font-light leading-relaxed">
            PURPLE YOU ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">2. Information We Collect</h2>
          <p className="mb-4 font-light leading-relaxed">
            We collect information you provide directly, such as:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Name and contact information (email, phone, address)</li>
            <li>Payment and billing information</li>
            <li>Shipping and delivery addresses</li>
            <li>Communication preferences</li>
            <li>Account information and passwords</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="mb-4 font-light leading-relaxed">
            We use the information we collect for:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Processing orders and delivering products</li>
            <li>Sending order confirmations and updates</li>
            <li>Responding to customer inquiries</li>
            <li>Improving our website and services</li>
            <li>Sending promotional emails (with your consent)</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4 font-light leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">5. Third-Party Links</h2>
          <p className="mb-4 font-light leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing any information.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">6. Your Rights</h2>
          <p className="mb-4 font-light leading-relaxed">
            You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@purpleyou.com.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">7. Contact Us</h2>
          <p className="mb-4 font-light leading-relaxed">
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <p className="font-light leading-relaxed">
            Email: privacy@purpleyou.com<br />
            Address: PURPLE YOU, India
          </p>
        </div>
      </div>
    </div>
  );
}
