import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

// Your store's UPI ID — payments collected here are NOT auto-verified.
// Confirm receipt manually in your UPI app before marking the order as paid.
const STORE_UPI_ID = "rohithupta31298@okhdfcbank"
const STORE_NAME = "Radha Lakshmi"

const UpiPaymentModal = ({ amount, onClose, onConfirm }) => {
  const [tab, setTab] = useState('qr') // 'qr' | 'id'
  const [customerUpiId, setCustomerUpiId] = useState('')

  const buildUpiLink = () => {
    const params = new URLSearchParams({
      pa: STORE_UPI_ID,
      pn: STORE_NAME,
      am: Number(amount).toFixed(2),
      cu: "INR",
      tn: "Order Payment",
    })
    return `upi://pay?${params.toString()}`
  }

  const handlePayWithId = () => {
    if (!customerUpiId.trim() || !customerUpiId.includes('@')) {
      return toast.error("Please enter a valid UPI ID (e.g. name@bank)")
    }
    // Opens the customer's own UPI app with payment details pre-filled.
    // Works on mobile devices with a UPI app installed; on desktop this link
    // generally won't do anything since there's no app to handle it.
    window.location.href = buildUpiLink()
  }

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-lg w-full max-w-sm p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-3 right-4 text-gray-500 hover:text-black text-xl cursor-pointer'
        >
          &times;
        </button>

        <h3 className='text-[18px] font-[700] mb-1'>UPI Payment</h3>
        <p className='text-[13px] text-gray-500 mb-4'>Amount to pay: <span className='font-[700] text-black'>₹{Number(amount).toFixed(2)}</span></p>

        <div className='flex gap-2 mb-5'>
          <button
            onClick={() => setTab('qr')}
            className={`flex-1 text-[13px] font-[500] py-2 rounded-full cursor-pointer ${tab === 'qr' ? 'bg-black/80 text-white' : 'ring-1 ring-slate-900/10'}`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setTab('id')}
            className={`flex-1 text-[13px] font-[500] py-2 rounded-full cursor-pointer ${tab === 'id' ? 'bg-black/80 text-white' : 'ring-1 ring-slate-900/10'}`}
          >
            Enter UPI ID
          </button>
        </div>

        {tab === 'qr' && (
          <div className='flex flex-col items-center'>
            <div className='p-3 ring-1 ring-slate-900/10 rounded-md'>
              <QRCodeSVG value={buildUpiLink()} size={200} />
            </div>
            <p className='text-[12px] text-gray-500 mt-3 text-center'>
              Scan with any UPI app (PhonePe, Google Pay, Paytm, etc.) to pay {STORE_NAME}.
            </p>
          </div>
        )}

        {tab === 'id' && (
          <div>
            <label className='text-[13px] font-[500] block mb-2'>Your UPI ID</label>
            <input
              type='text'
              value={customerUpiId}
              onChange={(e) => setCustomerUpiId(e.target.value)}
              placeholder='yourname@bank'
              className='w-full border ring-1 ring-slate-900/10 rounded-md px-3 py-2 text-[14px] mb-4 outline-none'
            />
            <button
              onClick={handlePayWithId}
              className='w-full bg-black/80 text-white text-[14px] font-[500] py-2 rounded-md cursor-pointer'
            >
              Open UPI App to Pay
            </button>
            <p className='text-[12px] text-gray-500 mt-2 text-center'>
              This opens your UPI app on mobile. On desktop, use the QR tab instead.
            </p>
          </div>
        )}

        <hr className='border-gray-300 my-4' />

        <button
          onClick={onConfirm}
          className='w-full bg-gray-700 text-white text-[14px] font-[500] py-2 rounded-md cursor-pointer'
        >
          I've Paid — Place Order
        </button>
        <p className='text-[11px] text-gray-400 mt-2 text-center'>
          Your order will be marked pending until payment is confirmed by us.
        </p>
      </div>
    </div>
  )
}

export default UpiPaymentModal