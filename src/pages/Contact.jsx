import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Crop Advice Question');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('5');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all mandatory fields (Name, Email, Message).');
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category,
          message: message.trim(),
          rating: parseInt(rating, 10)
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Submission failed. Please check your details.');
      } else {
        setSuccessMsg(data.message);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg('Network error: Could not reach the server to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <Breadcrumbs items={[{ label: 'Contact & Feedback' }]} />

      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.3rem', color: '#14532D', marginBottom: '8px' }}>
            Contact & Agronomic Feedback
          </h1>
          <p style={{ color: '#647067', margin: 0, fontSize: '1rem', lineHeight: 1.6 }}>
            Have a question about SEHAT-KRISHI AI, an observation from your fields, or suggestions to improve our regional crop models? Send us your message directly.
          </p>
        </div>

        {/* Official Toll-Free Helpline Info */}
        <div className="alert-banner info" style={{ marginBottom: '28px' }}>
          <Phone size={20} />
          <div>
            <strong>Government Emergency Agricultural Helpline:</strong> For immediate emergency crop emergencies or urgent locust/pest warnings, contact the Central Kisan Call Centre toll-free at <strong>1800-180-1551</strong> (6:00 AM – 10:00 PM, all Indian languages).
          </div>
        </div>

        {successMsg && (
          <div className="alert-banner success" style={{ marginBottom: '24px' }}>
            <CheckCircle2 size={20} />
            <div>
              <strong>Submission Successful!</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem' }}>{successMsg}</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="alert-banner danger" style={{ marginBottom: '24px' }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Validation Error</strong>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem' }}>{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Your Full Name *</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="E.g., Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email Address *</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-phone">Phone / WhatsApp Number (Optional)</label>
                <input
                  id="contact-phone"
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-cat">Topic / Inquiry Category</label>
                <select
                  id="contact-cat"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Crop Advice Question">Crop Advice Question</option>
                  <option value="Pest & Disease Diagnosis Query">Pest & Disease Diagnosis Query</option>
                  <option value="Market Price Reporting">Market Price / Mandi Reporting</option>
                  <option value="Technical Website Feedback">Technical Website Feedback</option>
                  <option value="KVK Partnership">KVK / Agricultural University Collaboration</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-rating">Rate Your Experience with SEHAT-KRISHI AI</label>
              <select
                id="contact-rating"
                className="form-select"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                <option value="4">⭐⭐⭐⭐ Very Good (4/5)</option>
                <option value="3">⭐⭐⭐ Good (3/5)</option>
                <option value="2">⭐⭐ Needs Improvement (2/5)</option>
                <option value="1">⭐ Poor (1/5)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Your Detailed Message or Feedback *</label>
              <textarea
                id="contact-message"
                rows="5"
                required
                className="form-textarea"
                placeholder="Describe your farming inquiry, feedback, or suggestions in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Send Message to Team'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
