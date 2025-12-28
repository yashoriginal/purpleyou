export const metadata = {
  title: "Terms and Conditions | PURPLE YOU",
  description:
    "PURPLE YOU's terms and conditions for using our website and purchasing jewelry",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8f5f2] border-b border-[#e6e0da]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wide mb-3">
            Terms and Conditions
          </h1>
          <p className="text-base text-[#6b6b6b] font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose prose-sm max-w-none text-[#6b6b6b]">
          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            1. Agreement to Terms
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            By accessing and using this website, you accept and agree to be
            bound by the terms and provision of this agreement. If you do not
            agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            2. Use License
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            Permission is granted to temporarily download one copy of the
            materials (information or software) on PURPLE YOU's website for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>
              Attempt to decompile or reverse engineer any software contained on
              the website
            </li>
            <li>
              Remove any copyright or other proprietary notations from the
              materials
            </li>
            <li>
              Transfer the materials to another person or "mirror" the materials
              on any other server
            </li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            3. Disclaimer
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            The materials on PURPLE YOU's website are provided "as is". PURPLE
            YOU makes no warranties, expressed or implied, and hereby disclaims
            and negates all other warranties including, without limitation,
            implied warranties or conditions of merchantability, fitness for a
            particular purpose, or non-infringement of intellectual property or
            other violation of rights.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            4. Limitations
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            In no event shall PURPLE YOU or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on PURPLE YOU's website.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            5. Accuracy of Materials
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            The materials appearing on PURPLE YOU's website could include
            technical, typographical, or photographic errors. PURPLE YOU does
            not warrant that any of the materials on our website are accurate,
            complete, or current. PURPLE YOU may make changes to the materials
            contained on our website at any time without notice.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            6. Links
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            PURPLE YOU has not reviewed all of the sites linked to our website
            and is not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by PURPLE YOU of
            the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            7. Modifications
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            PURPLE YOU may revise these terms and conditions for our website at
            any time without notice. By using this website, you are agreeing to
            be bound by the then current version of these terms and conditions.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            8. Governing Law
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            These terms and conditions are governed by and construed in
            accordance with the laws of India, and you irrevocably submit to the
            exclusive jurisdiction of the courts in that location.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">
            9. Contact Us
          </h2>
          <p className="mb-4 font-light leading-relaxed">
            If you have any questions about these Terms and Conditions, please
            contact us at support@purpleyou.com.
          </p>
        </div>
      </div>
    </div>
  );
}
