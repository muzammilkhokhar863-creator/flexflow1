import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import Button from '../components/Button.jsx';
import FormInput from '../components/FormInput.jsx';
import { apiRequest } from '../lib/api.js';

function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(0);
  const navigate = useNavigate();
  const isSignup = mode === 'signup';
  const isRecovering = recoveryStep > 0;

  function switchMode(nextMode) {
    setMode(nextMode);
    setRecoveryStep(0);
    setErrors({});
    setMessage('');
  }

  function startPasswordRecovery() {
    setRecoveryStep(1);
    setErrors({});
    setMessage('');
  }

  async function handleRecoverySubmit(event) {
    event.preventDefault();
    const email = form.email.trim();
    const nextErrors = {};

    if (!email) nextErrors.email = 'Enter your email address.';
    else if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8 || form.password.length > 128) nextErrors.password = 'Use 8–128 characters.';

    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await apiRequest('/api/auth/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email, password: form.password }),
      });
      setRecoveryStep(0);
      setForm({ ...form, password: '' });
      setMessage('Password reset. Sign in with your new password.');
    } catch (error) {
      setMessage(error.status === 400 || error.status === 404 || error.status === 503
        ? error.message
        : 'Password reset unavailable. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const email = form.email.trim();

    if (isSignup && !form.name.trim()) nextErrors.name = 'Enter your name.';
    else if (isSignup && form.name.trim().length > 100) nextErrors.name = 'Name must be 100 characters or fewer.';
    if (!email) nextErrors.email = 'Enter your email address.';
    else if (isSignup && (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email))) nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Enter your password.';
    else if (isSignup && (form.password.length < 8 || form.password.length > 128)) nextErrors.password = 'Use 8–128 characters.';

    setErrors(nextErrors);
    setMessage('');
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: form.name.trim(), email, password: form.password }),
        });
        navigate('/dashboard');
      } else {
        const { user } = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password: form.password }),
        });
        navigate(user.role === 'manager' ? '/manager/dashboard' : '/dashboard');
      }
    } catch (error) {
      if (isSignup && error.status === 409) setMessage('An account with this email already exists.');
      else if (isSignup && error.status === 400) setMessage(error.message);
      else if (isSignup) setMessage('Sign-up unavailable. Try again.');
      else if (error.status === 401) setMessage('Invalid email or password.');
      else setMessage('Sign-in unavailable. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page auth-page--interactive">
      <Link className="auth-back" to="/onboarding/3"><ArrowLeft size={16} /> Back to introduction</Link>
      <section className={`auth-switcher${isSignup ? ' is-signup' : ''}`}>
        <aside className="auth-welcome-panel">
          <Link className="brand auth-welcome-content__brand" to="/onboarding/1" aria-label="FixFlow home">
            <span className="brand__mark"><Wrench size={17} strokeWidth={2.5} /></span>
            <span>fix<span>flow</span></span>
          </Link>
          <div className="auth-welcome-panel__decoration auth-welcome-panel__decoration--one" />
          <div className="auth-welcome-panel__decoration auth-welcome-panel__decoration--two" />
          <div className="auth-welcome-content" key={`welcome-${mode}`}>
            <span className="auth-welcome-content__badge"><Sparkles size={14} /> FIXFLOW, MADE CLEAR</span>
            <span className="auth-welcome-content__mark"><Wrench size={20} /></span>
            <p className="auth-welcome-content__eyebrow">{isSignup ? 'A FRESH START FOR YOUR TECH' : 'YOUR REPAIR SPACE'}</p>
            <h2>{isSignup ? <>Good to have<br />you with us.</> : <>Welcome back<br />to FixFlow.</>}</h2>
            <p>{isSignup
              ? 'Create an account to keep your devices and repair updates together.'
              : 'Sign in to pick up where you left off and see your repair updates.'}</p>
            <button className="auth-welcome-content__toggle" type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>
              {isSignup ? 'Sign in instead' : 'Create an account'} <ArrowRight size={16} />
            </button>
            <div className="auth-welcome-content__trust"><ShieldCheck size={15} /><span>Clear steps. Helpful updates. No guesswork.</span></div>
          </div>
        </aside>

        <section className="auth-form-place" aria-live="polite">
          <div className="auth-form-content" key={`form-${mode}`}>
            <p className="eyebrow">{isRecovering ? 'ACCOUNT RECOVERY' : isSignup ? 'JOIN FIXFLOW' : 'WELCOME BACK'}</p>
            <h1>{isRecovering ? 'Reset your password' : isSignup ? 'Create your account' : 'Sign in to FixFlow'}</h1>
            <p className="auth-form-content__intro">{isRecovering
              ? 'Enter your account email and choose a new password.'
              : isSignup
                ? 'One simple place for your devices and repairs.'
                : 'Your devices and repair updates are right here.'}</p>

            {message && <div className="form-message" role="alert">{message}</div>}

            <form className="auth-form" onSubmit={isRecovering ? handleRecoverySubmit : handleSubmit} noValidate>
              {isSignup && !isRecovering && <FormInput id="auth-name" label="Your name" type="text" placeholder="Alex Morgan" autoComplete="name" value={form.name} error={errors.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}
              <FormInput id="auth-email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={form.email} error={errors.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <div className="password-field">
                <FormInput id="auth-password" label={isRecovering ? 'New password' : 'Password'} type={showPassword ? 'text' : 'password'} placeholder={isSignup || isRecovering ? '8–128 characters' : 'Enter your password'} autoComplete={isSignup || isRecovering ? 'new-password' : 'current-password'} value={form.password} error={errors.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {!isSignup && !isRecovering && <div className="auth-form__meta"><button type="button" className="text-button" onClick={startPasswordRecovery}>Forgot password?</button></div>}
              <Button type="submit" className="button--wide auth-form-content__submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isRecovering ? 'Please wait…' : isSignup ? 'Creating account…' : 'Signing in…'
                  : isRecovering ? 'Reset password' : isSignup ? 'Create account' : 'Sign in'}
                <ArrowRight size={16} />
              </Button>
            </form>

            {isRecovering
              ? <p className="auth-form-content__switch"><button type="button" onClick={() => { setRecoveryStep(0); setErrors({}); setMessage(''); }}>Back to sign in</button></p>
              : <p className="auth-form-content__switch">
                {isSignup ? 'Already have an account?' : 'New to FixFlow?'}{' '}
                <button type="button" onClick={() => switchMode(isSignup ? 'login' : 'signup')}>{isSignup ? 'Sign in' : 'Create account'}</button>
              </p>}
            {isSignup && <p className="auth-form-content__hint">Use a valid email and a password with 8–128 characters.</p>}
          </div>
        </section>
      </section>
      <p className="auth-footer auth-footer--interactive">Simple repairs. Clear updates. Better days.</p>
    </main>
  );
}

export default AuthPage;
