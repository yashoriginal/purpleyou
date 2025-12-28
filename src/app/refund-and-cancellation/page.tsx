export const metadata = {
  title: "Refund and Cancellation Policy | PURPLE YOU",
  description: "PURPLE YOU's refund and cancellation policy for jewelry purchases",
};

export default function RefundAndCancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8f5f2] border-b border-[#e6e0da]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wide mb-3">
            Refund and Cancellation Policy
          </h1>
          <p className="text-base text-[#6b6b6b] font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose prose-sm max-w-none text-[#6b6b6b]">
          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">1. Cancellation Policy</h2>
          <p className="mb-4 font-light leading-relaxed">
            At PURPLE YOU, we want you to be completely satisfied with your purchase. If you wish to cancel your order, please do so within 24 hours of placing it. Orders cancelled after 24 hours cannot be cancelled as they may have already been processed for shipment.
          </p>
          <p className="mb-4 font-light leading-relaxed">
            To cancel your order, please contact our customer service team at support@purpleyou.com with your order number.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">2. Return and Refund Policy</h2>
          <p className="mb-4 font-light leading-relaxed">
            We offer a 15-day return policy from the date of delivery for all jewelry items. To be eligible for a return:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>The item must be unused and in original condition</li>
            <li>All original packaging and documentation must be intact</li>
            <li>The item must not show signs of wear or handling</li>
            <li>Return must be initiated within 15 days of delivery</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">3. Return Process</h2>
          <p className="mb-4 font-light leading-relaxed">
            To initiate a return:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Contact our customer service at support@purpleyou.com with your order number and reason for return</li>
            <li>Obtain a return authorization and shipping label</li>
            <li>Pack the item securely in original packaging</li>
            <li>Ship the item to our returns address using the provided label</li>
            <li>Once received and inspected, your refund will be processed</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">4. Refund Processing</h2>
          <p className="mb-4 font-light leading-relaxed">
            Refunds are processed within 7-10 business days of receiving and inspecting the returned item. The refund will be credited to the original payment method. Please note that shipping costs are non-refundable unless the return is due to a defect or error on our part.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">5. Non-Returnable Items</h2>
          <p className="mb-4 font-light leading-relaxed">
            The following items are non-returnable:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Custom or personalized jewelry</li>
            <li>Items showing signs of wear, damage, or alteration</li>
            <li>Items returned without original packaging</li>
            <li>Clearance or final sale items</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">6. Defective Items</h2>
          <p className="mb-4 font-light leading-relaxed">
            If you receive a defective item, please contact us immediately with photos of the defect. We will either replace the item at no cost or issue a full refund, including return shipping costs.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">7. Exchanges</h2>
          <p className="mb-4 font-light leading-relaxed">
            If you wish to exchange an item for a different size, color, or style, please contact our customer service team. Exchanges are subject to the same conditions as returns and must be initiated within 15 days of delivery.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">8. Contact Us</h2>
          <p className="mb-4 font-light leading-relaxed">
            For any questions or to initiate a return, please contact us at:
          </p>
          <p className="font-light leading-relaxed">
            Email: support@purpleyou.com<br />
            Hours: Monday - Friday, 10 AM - 6 PM IST
          </p>
        </div>
      </div>
    </div>
  );
}
