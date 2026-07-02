import React from 'react'

const TermsAndPolicy = () => {
  return (
    <div className='max-w-4xl mx-auto px-4 py-12 text-gray-700'>

      <h1 className='text-3xl font-bold text-center text-[#41334e] mb-2'>Terms & Policies</h1>
      <p className='text-center text-sm text-gray-400 mb-10'>Last updated: June 2026 &nbsp;|&nbsp; Radha Laxmi Brand</p>

      {/* 1. No Return Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>1. No Return Policy</h2>
        <p className='mb-2'>
          At Radha Laxmi Brand, all sales are <strong>final</strong>. We do <strong>not accept returns</strong> on any product once the order has been delivered.
        </p>
        <p className='mb-2'>
          Due to   the breakable nature 
          of glass, absolutely NO RETURNS OF EXCHANGES
          will accepted under any circumstances Once the
          order has been processed and shipped. All sales of
          glass bangles are final.
        </p>
        <p className='mb-2'>
          We carefully inspect every bangle set before dispatch to ensure it meets our quality standards. We request customers to review product details, sizes, and images thoroughly before placing an order.
        </p>
        <p className='text-sm text-gray-500 italic'>
          Note: Returns are not accepted due to hygiene and safety reasons, which is standard practice for bangle products.
        </p>
      </section>

      {/* 2. Cancellation Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>2. Cancellation Policy</h2>
        <p className='mb-2'>
          Orders can be cancelled within <strong>24 hours</strong> of placement, provided the order has not yet been dispatched.
        </p>
        <ul className='list-disc list-inside space-y-1 mb-2'>
          <li>Orders may only be canceled within 24 hours of purchase.</li>
          <li>Cancellations requested after 24 hours will not be accepted.</li>
          <li>After 24 hours, your order cannot be altered, canceled, or refunded. All sales are final after this period</li>
          <li>For prepaid orders (Stripe/UPI), a refund will be initiated within <strong>2-3 business days</strong> to the original payment method after a successful cancellation.</li>
        </ul>
      </section>

      {/* 3. Exchange Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>3. Exchange Policy</h2>
        <p className='mb-2'>
          We offer a <strong>size exchange only</strong> in the following limited cases:
        </p>
        <ul className='list-disc list-inside space-y-1 mb-2'>
          <li>The wrong size was delivered (different from what was ordered).</li>
          <li>The product received is significantly different from what was shown.</li>
        </ul>
        <p className='mb-2'>
          To request an exchange, contact us within <strong>24 hours of delivery</strong> with clear unboxing photos as proof. Exchange requests without proof will not be entertained.
        </p>
        <p className='text-sm text-gray-500 italic'>
          Exchanges are subject to stock availability. If the requested size is unavailable, store credit will be issued.
        </p>
      </section>

      {/* 4. Shipping Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>4. Shipping Policy</h2>
        <ul className='list-disc list-inside space-y-1 mb-2'>
          <li>Orders are processed within <strong>1–2 or 5-7 business days</strong> of placement depending on your location..</li>
          <li>We currently deliver across India only.</li>
          <li>Shipping charges, if applicable, are displayed at checkout.</li>
          <li>Radha Lakshmi Brand is not responsible for delays caused by courier partners or natural circumstances.</li>
        </ul>
      </section>

      {/* 5. Product Disclaimer */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>5. Product Disclaimer</h2>
        <ul className='list-disc list-inside space-y-1 mb-2'>
          <li>Product colors may slightly vary due to lighting and screen display settings.</li>
          <li>Glass bangles are delicate by nature — handle with care. We are not responsible for breakage after delivery.</li>
          <li>All sizes are mentioned in the product description. Please refer to our size guide before ordering.</li>
          <li>Bangle sets are for personal use only and should not be worn during strenuous physical activity.</li>
        </ul>
      </section>

      {/* 6. Payment Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>6. Payment Policy</h2>
        <ul className='list-disc list-inside space-y-1 mb-2'>
          <li>We accept Cash on Delivery (COD), UPI/QR (via Cashfree), and Card payments (via Stripe).</li>
          <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes.</li>
          <li>COD orders are subject to availability in your area.</li>
          <li>Prepaid orders are confirmed immediately upon successful payment.</li>
          <li>We do not store any card or UPI information — all payments are handled by secure third-party gateways.</li>
        </ul>
      </section>

      {/* 7. Privacy Policy */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>7. Privacy Policy</h2>
        <p className='mb-2'>
          We collect only the information necessary to process your order (name, address, phone, email). Your data is never sold or shared with third parties except for delivery partners and payment gateways.
        </p>
        <p className='mb-2'>
          By placing an order, you consent to receiving order-related communication via email.
        </p>
      </section>

      {/* 8. Contact */}
      <section className='mb-8'>
        <h2 className='text-xl font-bold text-[#41334e] mb-3 border-b border-gray-200 pb-2'>8. Contact Us</h2>
        <p className='mb-2'>
          For any queries related to your order, cancellation, or exchange, reach out to us via our <a href='/contact' className='text-[#41334e] underline font-medium'>Contact page</a>. We typically respond within <strong>24 business hours</strong>.
        </p>
      </section>

      <p className='text-center text-xs text-gray-400 mt-10'>
        By placing an order on Radha Laxmi Brand, you agree to all the terms and policies listed above. These policies are subject to change without prior notice.
      </p>

    </div>
  )
}

export default TermsAndPolicy