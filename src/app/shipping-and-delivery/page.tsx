export const metadata = {
  title: "Shipping and Delivery | PURPLE YOU",
  description: "PURPLE YOU's shipping and delivery information for jewelry orders",
};

export default function ShippingAndDeliveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#f8f5f2] border-b border-[#e6e0da]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-light text-[#111111] tracking-wide mb-3">
            Shipping and Delivery
          </h1>
          <p className="text-base text-[#6b6b6b] font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="prose prose-sm max-w-none text-[#6b6b6b]">
          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">1. Shipping Methods</h2>
          <p className="mb-4 font-light leading-relaxed">
            PURPLE YOU offers the following shipping options:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li><strong>Standard Delivery (5-7 business days):</strong> Free on orders above ₹3000</li>
            <li><strong>Express Delivery (2-3 business days):</strong> Available for an additional charge</li>
            <li><strong>Overnight Delivery:</strong> Available in select locations</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">2. Delivery Areas</h2>
          <p className="mb-4 font-light leading-relaxed">
            We currently deliver to all major cities and towns across India. Delivery times may vary depending on your location and the selected shipping method. Remote areas may require additional delivery time.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">3. Order Processing</h2>
          <p className="mb-4 font-light leading-relaxed">
            All orders are processed within 24 business hours of placement. You will receive an order confirmation email immediately, followed by a shipping notification with tracking details once your order is dispatched.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">4. Tracking Your Order</h2>
          <p className="mb-4 font-light leading-relaxed">
            Once your order ships, you will receive a tracking number via email. You can use this number to track your package in real-time. We recommend tracking your order to ensure timely delivery.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">5. Delivery Confirmation</h2>
          <p className="mb-4 font-light leading-relaxed">
            Our courier partners will attempt to deliver your package during business hours. If you're not available, they will leave a notice. Please collect your package within 5 days of delivery notification to avoid return to sender.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">6. Damaged or Lost Packages</h2>
          <p className="mb-4 font-light leading-relaxed">
            If your package arrives damaged or is lost during transit, please report it immediately:
          </p>
          <ul className="list-disc list-inside mb-4 font-light leading-relaxed">
            <li>Contact our customer service within 24 hours of delivery</li>
            <li>Provide photos of the damage or packaging</li>
            <li>We will file a claim with the courier and provide a replacement or refund</li>
          </ul>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">7. Shipping Costs</h2>
          <p className="mb-4 font-light leading-relaxed">
            <strong>Free Shipping:</strong> On all orders above ₹3000<br />
            <strong>Standard Shipping:</strong> ₹99 for orders below ₹3000<br />
            <strong>Express Shipping:</strong> ₹299 (2-3 business days)<br />
            <strong>Overnight Shipping:</strong> ₹499 (selected locations only)
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">8. International Shipping</h2>
          <p className="mb-4 font-light leading-relaxed">
            Currently, we ship only within India. International shipping will be available soon. For inquiries about international orders, please contact support@purpleyou.com.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">9. Special Instructions</h2>
          <p className="mb-4 font-light leading-relaxed">
            If you have specific delivery instructions (safe place, gate number, etc.), please add them in the order notes during checkout. Our delivery partners will follow your instructions where possible.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">10. Packaging</h2>
          <p className="mb-4 font-light leading-relaxed">
            All PURPLE YOU jewelry is carefully packaged in elegant, protective packaging. We use eco-friendly materials wherever possible. Each order includes care instructions and information about your jewelry.
          </p>

          <h2 className="text-2xl font-light text-[#111111] mt-8 mb-4">11. Contact Us</h2>
          <p className="mb-4 font-light leading-relaxed">
            For shipping-related inquiries, please contact us:
          </p>
          <p className="font-light leading-relaxed">
            Email: shipping@purpleyou.com<br />
            Hours: Monday - Friday, 10 AM - 6 PM IST<br />
            For urgent delivery issues: support@purpleyou.com
          </p>
        </div>
      </div>
    </div>
  );
}
