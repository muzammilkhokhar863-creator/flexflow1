import { useState } from "react";
export default function RepairHistory(){
 const [status,setStatus]=useState("All statuses"),[search,setSearch]=useState("");
 return <><div className="heading"><div><small className="eyebrow">SERVICE OVERVIEW</small><h1>Repair history</h1><p>Track the progress and outcomes of your device repair requests.</p></div></div>
 <div className="panel history"><div className="history-head"><div><h2>Repair requests</h2><p>Search by request ID or filter by status.</p></div><div className="filters"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search request ID…" /><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option>{["Submitted","Received","Under Inspection","In Repair","Ready for Collection","Completed","Cancelled"].map(s=><option key={s}>{s}</option>)}</select></div></div>
 <div className="table-wrap"><table><thead><tr><th>REQUEST ID</th><th>DEVICE</th><th>DATE</th><th>FINAL STATUS</th></tr></thead><tbody><tr><td colSpan="4"><div className="table-empty"><span className="empty-icon">◷</span><b>No repair history available yet</b><small>Repair request data will appear when the team’s requests API is connected.</small></div></td></tr></tbody></table></div>
 <p className="integration">Selected filter: {status} · Search: {search||"—"}. Filters will be connected when the shared repair-request data contract is provided.</p></div></>;
}
