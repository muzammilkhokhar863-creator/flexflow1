import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';

function PlaceholderPage({ title, owner }) {
  return (
    <div className="placeholder-page">
      <PageHeader eyebrow="FIXFLOW WORKSPACE" title={title} description="This page will connect to the shared FixFlow experience." />
      <div className="placeholder-card"><span className="placeholder-card__icon"><Construction size={22} /></span><h2>Coming together</h2><p>This route is ready for {owner} to add the page content.</p><Link to="/dashboard"><ArrowLeft size={15} /> Return to overview</Link></div>
    </div>
  );
}

export default PlaceholderPage;
