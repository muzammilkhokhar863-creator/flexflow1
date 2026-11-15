import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock3, ShieldCheck, Smartphone, Sparkles, Wrench } from 'lucide-react';
import Button from '../components/Button.jsx';

const steps = [
  {
    eyebrow: 'WELCOME TO FIXFLOW',
    title: 'Good devices deserve\na second life.',
    body: 'Your everyday tech, cared for by people who know it best. Get repairs moving without the guesswork.',
    action: 'Meet your repair companion',
    visual: 'welcome',
    caption: 'A simpler way to get things working again',
  },
  {
    eyebrow: 'REPAIRS, MADE SIMPLE',
    title: 'Tell us what needs\na little attention.',
    body: 'Choose your device, describe the issue, and send a request in a few quick steps. We’ll take it from there.',
    action: 'Start with a repair request',
    visual: 'repair',
    caption: 'Clear steps, helpful updates, no surprises',
  },
  {
    eyebrow: 'ALWAYS IN THE LOOP',
    title: 'Know where your\nrepair stands.',
    body: 'Follow each update from inspection to collection. Your repair details stay together in one easy place.',
    action: 'See how tracking works',
    visual: 'tracking',
    caption: 'Your repair journey, at a glance',
  },
];

function OnboardingVisual({ kind }) {
  return (
    <div className={`onboarding-art onboarding-art--${kind}`} aria-label="Illustration preview of the FixFlow repair experience" role="img">
      <div className="art-orbit art-orbit--one" /><div className="art-orbit art-orbit--two" />
      <div className="art-window">
        <div className="art-window__top"><span /><span /><span /><b>fixflow</b></div>
        {kind === 'welcome' && <div className="art-device"><div className="art-device__screen"><Smartphone size={32} /><span>All your tech,<br />in good hands.</span><i /></div><div className="art-device__base" /></div>}
        {kind === 'repair' && <div className="art-repair-card"><span className="art-card-icon"><Wrench size={20} /></span><strong>New repair request</strong><small>Tell us a little about your device</small><div className="art-input">Device type <b>Phone</b></div><div className="art-input">What’s the issue? <b>Screen repair</b></div><div className="art-button">Continue <ArrowRight size={13} /></div></div>}
        {kind === 'tracking' && <div className="art-track-card"><div className="art-track-card__title"><span><Wrench size={16} /></span><div><small>REPAIR STATUS</small><strong>Your device repair</strong></div><b>•••</b></div><div className="art-track-line"><i /><i /><i /><i /></div><div className="art-track-labels"><span>Received</span><span>Inspecting</span><span>Repairing</span><span>Ready</span></div><div className="art-update"><span className="art-update__check"><Check size={13} /></span><div><strong>Updates as they happen</strong><small>Follow each step of your repair</small></div><Clock3 size={14} /></div></div>}
      </div>
      <div className="art-spark art-spark--one"><Sparkles size={18} /></div>
      <div className="art-spark art-spark--two"><ShieldCheck size={20} /></div>
      <div className="art-float-chip"><span className="art-float-chip__dot" /> Repair updates, made clear</div>
    </div>
  );
}

function Onboarding() {
  const { step: stepParam } = useParams();
  const navigate = useNavigate();
  const stepNumber = Number(stepParam);
  const activeStep = Math.min(3, Math.max(1, Number.isNaN(stepNumber) ? 1 : stepNumber));
  const content = steps[activeStep - 1];

  function goToStep(nextStep) {
    if (nextStep > 3) navigate('/login');
    else if (nextStep < 1) navigate('/onboarding/1');
    else navigate(`/onboarding/${nextStep}`);
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <Link className="brand" to="/onboarding/1"><span className="brand__mark"><Wrench size={18} strokeWidth={2.5} /></span><span>fix<span>flow</span></span></Link>
        <div className="onboarding-header__right"><span>Already have an account?</span><Link to="/login">Log in</Link></div>
      </header>
      <section className="onboarding-main" aria-live="polite">
        <div className="onboarding-copy">
          <div className="step-kicker"><span>0{activeStep}</span><i /> STEP 0{activeStep} OF 03</div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title.split('\n').map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}<br /></span>)}</h1>
          <p className="onboarding-copy__body">{content.body}</p>
          <div className="onboarding-benefit"><span><Check size={14} /></span>{content.action}</div>
          <div className="onboarding-controls">
            <div className="onboarding-dots" aria-label={`Step ${activeStep} of 3`}>
              {steps.map((item, index) => <button key={item.visual} type="button" className={index + 1 === activeStep ? 'is-current' : ''} onClick={() => goToStep(index + 1)} aria-label={`Go to step ${index + 1}`} />)}
            </div>
            <div className="onboarding-controls__buttons">
              {activeStep > 1 && <button className="onboarding-back" onClick={() => goToStep(activeStep - 1)} type="button" aria-label="Previous step"><ArrowLeft size={19} /></button>}
              <Button onClick={() => goToStep(activeStep + 1)}>{activeStep === 3 ? 'Get started' : 'Continue'} <ArrowRight size={17} /></Button>
            </div>
          </div>
          <button className="onboarding-skip" type="button" onClick={() => navigate('/login')}>Skip intro <ArrowRight size={14} /></button>
        </div>
        <div className="onboarding-visual-wrap"><OnboardingVisual kind={content.visual} /><p className="onboarding-visual-caption"><span />{content.caption}</p></div>
      </section>
      <footer className="onboarding-footer"><span>© 2026 FixFlow</span><span>Repairs that move with you.</span><span><ShieldCheck size={14} /> Your devices are in good hands</span></footer>
    </main>
  );
}

export default Onboarding;
