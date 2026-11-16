import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight, Plus, Wrench, CheckCircle2, Smartphone } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import SummaryCard from '../components/SummaryCard.jsx';

function CustomerDashboard() {
  const { user } = useOutletContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="dashboard-page">
      <PageHeader eyebrow="CUSTOMER OVERVIEW" title={`${greeting}, ${user.name}`} description="Here’s what’s happening with your devices today." action={<Link className="button" to="/new-repair"><Plus size={17} /> New repair</Link>} />
      <section className="dashboard-summary" aria-label="Repair summary">
        <SummaryCard label="Active repairs" value="—" note="Request data will appear here" icon={<Wrench size={19} />} tone="blue" />
        <SummaryCard label="Ready to collect" value="—" note="Updates will appear here" icon={<CheckCircle2 size={19} />} tone="green" />
        <SummaryCard label="Registered devices" value="—" note="Device data will appear here" icon={<Smartphone size={19} />} tone="purple" />
      </section>

      <section className="dashboard-content-grid">
        <div className="panel recent-panel">
          <div className="panel-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h2>Recent repair requests</h2></div><Link className="panel-link" to="/history">View all <ArrowRight size={15} /></Link></div>
          <div className="request-empty">
            <span className="request-empty__icon"><Wrench size={19} /></span>
            <strong>No repair requests yet</strong>
            <p>Your repair updates will appear here after you submit a request.</p>
            <Link className="button button--secondary" to="/new-repair">Create a repair request <ArrowRight size={15} /></Link>
          </div>
        </div>

        <aside className="next-step-card">
          <div className="next-step-card__spark" aria-hidden="true">✦</div>
          <p className="eyebrow">YOUR FIXFLOW SPACE</p>
          <h2>Your repairs,<br />all in one place.</h2>
          <p>When you add devices and submit requests, their details and updates will be easy to find here.</p>
          <Link to="/devices" className="next-step-card__link">Explore your devices <ArrowRight size={16} /></Link>
          <div className="next-step-card__decoration"><span /><span /><span /></div>
        </aside>
      </section>

      <section className="dashboard-bottom">
        <div className="tip-card"><span className="tip-card__icon"><Smartphone size={18} /></span><div><strong>Keep your devices close</strong><p>Add a device once to make future repair requests quicker.</p></div><Link to="/devices">My devices <ArrowRight size={15} /></Link></div>
        <div className="dashboard-help"><span>Need help with a repair?</span><Link to="/help">Visit our help center <ArrowRight size={14} /></Link></div>
      </section>
    </div>
  );
}

export default CustomerDashboard;
