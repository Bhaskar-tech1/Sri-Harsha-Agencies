'use client';

import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { openWhatsAppMessage } from '@/lib/whatsapp';
import { siteConfig } from '@/config/site';

const types = ['Product supply or wholesale', 'Corporate gifting', 'Custom packs', 'Bulk pricing', 'Event or celebration', 'Retail / distribution', 'Other requirement'];

export default function BulkEnquiryForm() {
  const [message, setMessage] = useState(null);

  function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    const text = `Hello ${siteConfig.name}, I would like to make a bulk enquiry.\n\nName: ${fields.name}\nCompany: ${fields.company || 'Not provided'}\nMobile: ${fields.mobile}\nEmail: ${fields.email}\nLocation: ${fields.location || 'Not provided'}\nRequirement type: ${fields.type}\nApproximate quantity: ${fields.quantity || 'Not provided'}\n\nRequirement details:\n${fields.requirement}`;
    const result = openWhatsAppMessage(text);
    if (result === 'opened') setMessage({ kind: 'success', text: 'WhatsApp has opened with your enquiry. Review the message and press Send to complete it.' });
    else if (result === 'blocked') setMessage({ kind: 'error', text: 'Your browser blocked the WhatsApp tab. Allow pop-ups to continue; the enquiry has not been sent.' });
    else setMessage({ kind: 'error', text: 'WhatsApp contact is not configured yet. Your details have not been sent; please try again after the business number is added.' });
  }

  return (
    <form className="enquiry-form bulk-order-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="form-field"><span>Full name <b>*</b></span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
        <label className="form-field"><span>Company / organisation</span><input name="company" autoComplete="organization" placeholder="Company name (optional)" /></label>
        <label className="form-field"><span>Mobile number <b>*</b></span><input name="mobile" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() .-]{7,18}" placeholder="10-digit number" title="Enter a valid phone number" required /></label>
        <label className="form-field"><span>Email address <b>*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label>
        <label className="form-field"><span>Location</span><input name="location" autoComplete="address-level2" placeholder="City / State" /></label>
        <label className="form-field"><span>Requirement type <b>*</b></span><select name="type" defaultValue="" required><option value="" disabled>Select type</option>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
      </div>
      <div className="form-grid form-grid--single">
        <label className="form-field"><span>Approximate quantity</span><input name="quantity" placeholder="e.g. 100 jars, 50 hampers" /></label>
        <label className="form-field"><span>Your requirement <b>*</b></span><textarea name="requirement" rows="4" placeholder="Describe the products, quantities, timeline or packaging you have in mind..." required /></label>
      </div>
      <div className="form-submit-row"><p><MessageCircle size={15} /> Your enquiry opens in WhatsApp for you to review before sending.</p><button className="button button--orange" type="submit">Submit enquiry <ArrowUpRight size={17} /></button></div>
      {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className={`form-feedback form-feedback--${message.kind}`}>{message.text}</p>}
    </form>
  );
}
