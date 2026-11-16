import { useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Laptop,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react';

const steps = [
  {
    label: 'A calmer repair experience',
    title: ['A better day', 'for your devices.'],
    description: 'FixFlow makes it easier to get help for the tech you rely on, with a clear place for your repair requests and updates.',
    benefits: ['Simple repair requests', 'Helpful updates in one place'],
    tab: 'Start here',
    caption: 'Your devices, cared for with clarity.',
    visual: 'care',
  },
  {
    label: 'Repairs, made simple',
    title: ['Tell us what needs', 'a little attention.'],
    description: 'Choose your device, describe what is happening, and send the details to the repair team in a few straightforward steps.',
    benefits: ['Share the issue in a few steps', 'Keep the details together'],
    tab: 'Request a repair',
    caption: 'A clear start makes a smoother repair.',
    visual: 'request',
  },
  {
    label: 'Always in the loop',
    title: ['Know where your', 'repair stands.'],
    description: 'Follow the important stages from submission to collection, so you know what is happening and what comes next.',
    benefits: ['See the current repair stage', 'Know when it is ready to collect'],
    tab: 'Follow progress',
    caption: 'Every important update, easy to find.',
    visual: 'progress',
  },
];

function OnboardingArtwork({ visual }) {
  if (visual === 'request') {
    return (
      <div className="intro-preview intro-preview--request" role="img" aria-label="Illustration of a simple repair request form">
        <div className="intro-preview__top"><span className="intro-preview__logo"><Wrench size={15} /></span><span>FIXFLOW REPAIR DESK</span><span className="intro-preview__dots">•••</span></div>
        <div className="request-preview">
          <div className="request-preview__step"><span className="is-done"><Check size={13} /></span><i /><span className="is-current">2</span><i /><span>3</span></div>
          <p className="preview-kicker">STEP 2 OF 3</p>
          <h3>What needs attention?</h3>
          <p className="preview-muted">A few details help us understand the issue.</p>
          <div className="preview-field"><span>Device</span><strong><Smartphone size={15} /> Phone <span>⌄</span></strong></div>
          <div className="preview-field"><span>Issue</span><strong>Choose a repair type <span>⌄</span></strong></div>
          <div className="preview-button">Continue <ArrowRight size={14} /></div>
        </div>
        <div className="intro-preview__note"><CheckCircle2 size={16} /><span>Clear steps, from the start</span></div>
      </div>
    );
  }

  if (visual === 'progress') {
    return (
      <div className="intro-preview intro-preview--progress" role="img" aria-label="Illustration of repair progress updates">
        <div className="intro-preview__top"><span className="intro-preview__logo"><Wrench size={15} /></span><span>REPAIR PROGRESS</span><span className="intro-preview__dots">•••</span></div>
        <div className="progress-preview">
          <div className="progress-preview__heading"><span className="progress-preview__icon"><Smartphone size={18} /></span><div><span>YOUR REPAIR</span><strong>Phone repair</strong></div><span className="progress-preview__badge"><i /> In progress</span></div>
          <div className="progress-preview__timeline">
            <div className="progress-stage is-complete"><span><Check size={12} /></span><div><strong>Request received</strong><small>Your repair is in the system</small></div></div>
            <div className="progress-stage is-current"><span><Clock3 size={12} /></span><div><strong>Under inspection</strong><small>The team is checking your device</small></div></div>
            <div className="progress-stage"><span>3</span><div><strong>Repair in progress</strong><small>We’ll update you as it moves along</small></div></div>
            <div className="progress-stage"><span>4</span><div><strong>Ready for collection</strong><small>We’ll let you know when it’s ready</small></div></div>
          </div>
        </div>
        <div className="intro-preview__note"><ShieldCheck size={16} /><span>Your next step is always clear</span></div>
      </div>
    );
  }

  return (
    <div className="intro-preview intro-preview--care" role="img" aria-label="Illustration of devices in a calm, organized workspace">
      <div className="intro-preview__top"><span className="intro-preview__logo"><Wrench size={15} /></span><span>YOUR FIXFLOW SPACE</span><span className="intro-preview__dots">•••</span></div>
      <div className="care-preview">
        <div className="care-preview__welcome"><span className="care-preview__spark"><Sparkles size={16} /></span><div><span>GOOD CARE, MADE SIMPLE</span><strong>Your tech has a place here.</strong><small>Repair requests and helpful updates, together.</small></div></div>
        <div className="care-preview__devices">
          <div className="care-device"><span><Smartphone size={20} /></span><div><strong>Phone</strong><small>Ready for support</small></div><ArrowRight size={15} /></div>
          <div className="care-device"><span><Laptop size={20} /></span><div><strong>Laptop</strong><small>Ready for support</small></div><ArrowRight size={15} /></div>
        </div>
        <div className="care-preview__footer"><ShieldCheck size={15} /><span>Your repair journey, kept clear</span><span className="care-preview__line" /></div>
      </div>
      <div className="intro-preview__note"><CheckCircle2 size={16} /><span>A thoughtful place for your devices</span></div>
    </div>
  );
}

function Onboarding() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const parsedStep = Number(stepParam);
  const activeStep = Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= steps.length ? parsedStep : 1;
  const content = steps[activeStep - 1];

  const goToStep = useCallback((step) => {
    if (step > steps.length) {
      navigate('/login');
      return;
    }
    navigate(`/onboarding/${Math.max(1, step)}`);
  }, [navigate]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input, textarea, select')) return;
      if (event.key === 'ArrowRight') goToStep(activeStep + 1);
      if (event.key === 'ArrowLeft' && activeStep > 1) goToStep(activeStep - 1);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStep, goToStep]);

  return (
    <main className="intro-page">
      <header className="intro-header">
        <Link className="brand" to="/onboarding/1" aria-label="FixFlow home">
          <span className="brand__mark"><Wrench size={18} strokeWidth={2.5} /></span>
          <span>fix<span>flow</span></span>
        </Link>
        <span className="intro-header__promise">Smart device care, made clearer</span>
        <div className="intro-header__account">
          <Link className="intro-header__signin" to="/login">Sign in</Link>
          <Link className="intro-header__signup" to="/signup">Create account</Link>
        </div>
      </header>

      <section className="intro-main" aria-live="polite">
        <div className="intro-copy" key={activeStep}>
          <div className="intro-overline"><span className="intro-overline__dot" />{content.label}</div>
          <h1>{content.title[0]}<br /><em>{content.title[1]}</em></h1>
          <p className="intro-copy__description">{content.description}</p>
          <ul className="intro-benefits">
            {content.benefits.map((benefit) => <li key={benefit}><span><Check size={13} /></span>{benefit}</li>)}
          </ul>
          <div className="intro-actions">
            {activeStep > 1 && <button className="intro-back" type="button" onClick={() => goToStep(activeStep - 1)} aria-label="Previous step"><ArrowLeft size={18} /></button>}
            <button className="button intro-continue" type="button" onClick={() => goToStep(activeStep + 1)}>
              {activeStep === steps.length ? 'Get started' : 'Continue'} <ArrowRight size={17} />
            </button>
            {activeStep < steps.length && <button className="intro-skip" type="button" onClick={() => navigate('/login')}>Skip intro</button>}
          </div>
          <nav className="intro-steps intro-steps--glass" aria-label="Introduction pages">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              return (
                <button
                  className={`intro-dot${stepNumber === activeStep ? ' is-active' : ''}${stepNumber < activeStep ? ' is-complete' : ''}`}
                  type="button"
                  key={step.tab}
                  onClick={() => goToStep(stepNumber)}
                  aria-label={`Go to page ${stepNumber}: ${step.tab}`}
                  aria-current={stepNumber === activeStep ? 'step' : undefined}
                ><span /></button>
              );
            })}
          </nav>
        </div>

        <div className="intro-showcase" key={`visual-${activeStep}`}>
          <div className="intro-showcase__top"><span>THE FIXFLOW FLOW</span><span>0{activeStep} <i /> 03</span></div>
          <div className={`intro-showcase__stage intro-showcase__stage--${content.visual}`}>
            <span className="intro-orbit intro-orbit--one" /><span className="intro-orbit intro-orbit--two" />
            <span className="intro-float intro-float--left"><ShieldCheck size={18} /></span>
            <span className="intro-float intro-float--right"><Sparkles size={18} /></span>
            <OnboardingArtwork visual={content.visual} />
          </div>
          <div className="intro-showcase__caption"><span className="intro-showcase__caption-icon"><CheckCircle2 size={17} /></span><p>{content.caption}</p><span className="intro-showcase__caption-rule" /></div>
        </div>
      </section>

    </main>
  );
}

export default Onboarding;
