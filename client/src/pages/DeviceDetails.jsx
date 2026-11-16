import { useEffect,useState } from "react";
import { Link,useParams } from "react-router-dom";
import { getDevice } from "../api/devices";
export default function DeviceDetails(){
 const {id}=useParams();const [device,setDevice]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{getDevice(id).then(setDevice).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[id]);
 return <><div className="heading"><div><small className="eyebrow">DEVICE PROFILE</small><h1>Device details</h1><p>Review the information saved for this device.</p></div><Link className="btn secondary" to="/devices">← My devices</Link></div>
 {loading&&<div className="panel message">Loading device details…</div>}{error&&<div className="alert">{error}</div>}
 {!loading&&!error&&!device&&<div className="panel empty"><h2>Device not found</h2><Link className="btn primary" to="/devices">Back to devices</Link></div>}
 {device&&<><div className="panel details"><div className="detail-head"><span className="device-icon big">▱</span><div className="detail-name"><span className="pill">Registered</span><h2>{device.nickname||`${device.brand} ${device.model}`}</h2><p>{device.type} · {device.brand} {device.model}</p></div><Link className="btn primary" to={`/devices/${id}/edit`}>Edit device</Link></div>
 <div className="detail-grid">{[["DEVICE TYPE",device.type],["BRAND",device.brand],["MODEL",device.model],["SERIAL NUMBER",device.serial||"Not provided"],["NICKNAME",device.nickname||"Not set"],["DATE ADDED",device.createdAt?new Date(device.createdAt).toLocaleDateString():"—"]].map(([k,v])=><div key={k}><small>{k}</small><b>{v}</b></div>)}</div></div>
 <div className="section-title"><small className="eyebrow">SERVICE ACTIVITY</small><h2>Related repair requests</h2></div><div className="panel empty compact"><span className="empty-icon">◷</span><h3>No repair requests linked yet</h3><p>Related requests will appear when the team’s repair-request API is integrated.</p></div></>}
 </>;
}
