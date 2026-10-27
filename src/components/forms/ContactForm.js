'use client';

import { useState } from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { openWhatsAppMessage } from '@/lib/whatsapp';
import { siteConfig } from '@/config/site';

const enquiryTypes = ['Product question', 'Order enquiry', 'Bulk order', 'Gifting', 'Other'];

export function ContactForm() {
  const [message, setMessage] = useState(null);
  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
    const text = `Hello ${siteConfig.name}, I have a question.\n\nName: ${fields.name}\nMobile: ${fields.mobile}\nEmail: ${fields.email || 'Not provided'}\nEnquiry type: ${fields.type}\n\nMessage:\n${fields.message}`;
    const result = openWhatsAppMessage(text);
    if (result === 'opened') setMessage({ kind: 'success', text: 'WhatsApp has opened with your enquiry. Review the message and press Send to complete it.' });
    else if (result === 'blocked') setMessage({ kind: 'error', text: 'Your browser blocked the WhatsApp tab. Allow pop-ups to continue; the enquiry has not been sent.' });
    else setMessage({ kind: 'error', text: 'WhatsApp contact is not configured yet. Your details have not been sent; please try again after the business number is added.' });
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid">
        <label className="form-field"><span>Full name <b>*</b></span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
        <label className="form-field"><span>Mobile number <b>*</b></span><input name="mobile" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() .-]{7,18}" placeholder="Your contact number" required /></label>
        <label className="form-field"><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label className="form-field"><span>Enquiry type <b>*</b></span><select name="type" defaultValue="" required><option value="" disabled>Select a topic</option>{enquiryTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="form-field form-field--full"><span>Your message <b>*</b></span><textarea name="message" rows="5" placeholder="How can we help?" required /></label>
      </div>
      <div className="form-submit-row"><p><MessageCircle size={15} /> Your enquiry is prepared in WhatsApp for you to send.</p><button className="button button--orange" type="submit">Send an enquiry <ArrowUpRight size={17} /></button></div>
      {message && <p role={message.kind === 'error' ? 'alert' : 'status'} className={`form-feedback form-feedback--${message.kind}`}>{message.text}</p>}
    </form>
  );
}
