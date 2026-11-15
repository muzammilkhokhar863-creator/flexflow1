import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Wrench } from 'lucide-react';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import { apiRequest } from '../lib/api.js';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.';
    if (!form.password.trim()) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      const { user } = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      navigate(user.role === 'manager' ? '/manager/dashboard' : '/dashboard');
    } catch (error) {
      setMessage(error.status === 401 ? 'Email or password is incorrect.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="auth-back" to="/onboarding/3"><ArrowLeft size={16} /> Back to introduction</Link>
      <section className="auth-card">
        <Link className="brand auth-card__brand" to="/onboarding/1"><span className="brand__mark"><Wrench size={18} strokeWidth={2.5} /></span><span>fix<span>flow</span></span></Link>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Let’s get you<br />back on track.</h1>
        <p className="auth-card__intro">Sign in to follow your repairs and keep your devices in good hands.</p>
        {message && <div className="form-message" role="alert">{message}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <FormInput id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <div className="password-field"><FormInput id="password" label="Password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
          <div className="auth-form__meta"><button type="button" className="text-button" onClick={() => setMessage('Password reset is not available yet. Please contact the project manager.')}>Forgot password?</button></div>
          <Button type="submit" className="button--wide" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Log in'} <ArrowRight size={17} /></Button>
        </form>
        <p className="auth-card__switch">New to FixFlow? <Link to="/signup">Create an account</Link></p>
      </section>
      <p className="auth-footer">Simple repairs. Clear updates. Better days.</p>
    </main>
  );
}

export default Login;
