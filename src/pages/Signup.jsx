import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Wrench } from 'lucide-react';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import { apiRequest } from '../lib/api.js';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8) nextErrors.password = 'Use at least 8 characters.';
    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      });
      navigate('/dashboard');
    } catch (error) {
      if (error.status === 409) setErrors({ email: error.message });
      else setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page auth-page--signup">
      <Link className="auth-back" to="/login"><ArrowLeft size={16} /> Back to log in</Link>
      <section className="auth-card">
        <Link className="brand auth-card__brand" to="/onboarding/1"><span className="brand__mark"><Wrench size={18} strokeWidth={2.5} /></span><span>fix<span>flow</span></span></Link>
        <p className="eyebrow">A FRESH START FOR YOUR TECH</p>
        <h1>Make room for<br />better device days.</h1>
        <p className="auth-card__intro">Create your customer account to request repairs and keep every update close.</p>
        {message && <div className="form-message" role="alert">{message}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FormInput id="name" label="Your name" type="text" placeholder="Alex Morgan" autoComplete="name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <FormInput id="signup-email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FormInput id="signup-password" label="Create a password" type="password" placeholder="At least 8 characters" autoComplete="new-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <Button type="submit" className="button--wide" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Create account'} <ArrowRight size={17} /></Button>
        </form>
        <p className="auth-card__switch">Already have an account? <Link to="/login">Log in</Link></p>
        <div className="auth-note">Use a valid email and a password with at least 8 characters.</div>
      </section>
      <p className="auth-footer">Simple repairs. Clear updates. Better days.</p>
    </main>
  );
}

export default Signup;
