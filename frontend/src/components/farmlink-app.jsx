'use client'

import { useState, useEffect } from 'react'
import { ArrowDownRight, ArrowUpRight, Bell, Bike, CalendarDays, Check, ChevronDown, CircleHelp, CloudSun, FileText, LayoutDashboard, Leaf, ListFilter, MapPin, Menu, Package, Plus, Search, Settings, ShoppingBag, Truck, UserRound, Wheat, X, Zap } from 'lucide-react'
import { farmerNav, buyerNav, lots as mockLots, produce as mockProduce, notifications, shipment, order as mockOrder, pricePoints, demandPoints } from '../lib/mock/data.js'
import { lotService, marketplaceService, orderService } from '../lib/api/services.js'
import MapLeaflet from './MapLeaflet.jsx'

const icons = { Dashboard: LayoutDashboard, 'My Lots': Package, 'Add Produce': Plus, Orders: FileText, 'Market Prices': ArrowUpRight, 'AI Insights': Zap, Shipments: Truck, Profile: UserRound, 'Find Produce': Search, 'My Tenders': ListFilter, 'Market Intelligence': ArrowUpRight }

function Logo() { return <div className="flex items-center gap-2.5"><div className="flex size-9 items-center justify-center rounded-xl bg-[#2f6b45] text-white"><Leaf /></div><span className="text-xl font-bold tracking-tight text-[#193b28]">Farm<span className="text-[#6d9f54]">Link</span></span></div> }
function Badge({ children, tone = 'green' }) { return <span className={`badge badge-${tone}`}>{children}</span> }
function Metric({ label, value, change, icon: Icon, tone }) { return <div className="metric-card"><div className={`metric-icon ${tone}`}><Icon /></div><div className="min-w-0"><p className="eyebrow">{label}</p><p className="metric-value">{value}</p><p className="metric-change"><ArrowUpRight /> {change}</p></div></div> }
function SectionHeader({ title, action }) { return <div className="section-header"><h2>{title}</h2>{action && <button className="text-button">{action} <span>→</span></button>}</div> }
function MiniChart({ points, color = '#5d965c' }) { const max=Math.max(...points), min=Math.min(...points); const d=points.map((p,i)=>`${i?'L':'M'} ${i*100/(points.length-1)} ${100-(p-min)/(max-min)*78-10}`).join(' '); return <svg className="mini-chart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Trend chart"><path d={`${d} L 100 100 L 0 100 Z`} fill={`${color}18`} /><path d={d} fill="none" stroke={color} strokeWidth="2.3" vectorEffect="non-scaling-stroke" /></svg> }
function Sidebar({ role, active, setActive }) { const nav=role==='farmer'?farmerNav:buyerNav; return <aside className="sidebar"><div className="sidebar-brand"><Logo /></div><div className="workspace"><div className="workspace-avatar">{role==='farmer'?'RK':'FC'}</div><div><p className="workspace-name">{role==='farmer'?'Ramesh Kumar':'FreshCart Foods'}</p><p className="workspace-role">{role==='farmer'?'Farmer account':'Buyer account'}</p></div><ChevronDown className="ml-auto" /></div><nav className="sidebar-nav">{nav.map(item=>{const Icon=icons[item]??Package; return <button key={item} onClick={()=>setActive(item)} className={`nav-item ${active===item?'active':''}`}><Icon />{item}{item==='Orders'&&<span className="nav-count">2</span>}</button>})}</nav><div className="sidebar-bottom"><button className="nav-item"><CircleHelp />Help centre</button><button className="nav-item"><Settings />Settings</button><div className="season-note"><CloudSun /><div><b>Good season ahead</b><span>Market activity is up 12%</span></div></div></div></aside> }
function Topbar({ role, setRole }) { return <header className="topbar"><button className="mobile-menu"><Menu /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><b>{role==='farmer'?'Farmer dashboard':'Buyer dashboard'}</b></div><div className="top-actions"><div className="role-switch"><button className={role==='farmer'?'selected':''} onClick={()=>setRole('farmer')}>Farmer</button><button className={role==='buyer'?'selected':''} onClick={()=>setRole('buyer')}>Buyer</button></div><button className="icon-button" aria-label="Notifications"><Bell /><i /></button><div className="top-avatar">RK</div></div></header> }
function ShipmentCard() { return <div className="card shipment-card"><div className="card-heading"><div><p className="eyebrow">Active shipment</p><h3>{shipment.id} <Badge tone="blue">{shipment.status}</Badge></h3></div><button className="more">•••</button></div><div className="route-line"><div className="route-stop"><span className="route-dot farm" /><div><b>Your farm</b><small>Panipat, Haryana</small></div></div><div className="route-rail"><span /><span /><span /></div><div className="route-stop"><span className="route-dot buyer" /><div><b>FreshCart Foods</b><small>Azadpur Mandi, Delhi</small></div></div></div><div className="shipment-details"><div><span>Vehicle</span><b>{shipment.vehicle}</b></div><div><span>Current location</span><b>{shipment.location}</b></div><div><span>ETA</span><b>{shipment.eta}</b></div></div><button className="outline-button full">Track shipment <ArrowUpRight /></button></div> }
function QualityCard() { return <div className="card quality-card"><div className="card-heading"><div><p className="eyebrow">Visual quality assessment</p><h3>Onion <Badge>Grade A</Badge></h3></div><div className="quality-score">87<span>/100</span></div></div><p className="muted">Based on visible produce quality.</p><div className="quality-bars"><div><span>Good produce <b>82%</b></span><i><em style={{width:'82%'}} /></i></div><div><span>Damaged <b>8%</b></span><i><em className="amber" style={{width:'8%'}} /></i></div><div><span>Rotten <b>5%</b></span><i><em className="red" style={{width:'5%'}} /></i></div></div><button className="text-button">View quality report <span>→</span></button></div> }
function InsightCard() { return <div className="card insight-card"><div className="insight-top"><span className="ai-label"><Zap /> AI market insight</span><span className="insight-date">Updated today</span></div><div className="insight-crop"><div className="crop-illustration onion">◌</div><div><p className="eyebrow">Onion</p><h3>Price is expected to rise</h3></div></div><div className="price-compare"><div><span>Current market price</span><b>₹2,600 <small>/ qtl</small></b></div><ArrowUpRight /><div><span>Expected in 5 days</span><b className="green-text">₹2,780 <small>/ qtl</small></b></div></div><div className="recommendation"><Check /><p><b>Recommendation</b>Consider holding for a few days.</p></div><p className="disclaimer">Based on recent mandi prices and demand in Delhi.</p></div> }
function LotsTable() { 
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lotService.list().then(data => {
      setLots(data);
      setLoading(false);
    });
  }, []);

  return <div className="card lots-card"><SectionHeader title="My produce" action="View all lots" /><div className="table-wrap"><table><thead><tr><th>Crop</th><th>Quantity</th><th>Grade</th><th>Status</th><th>Expected price</th><th>Buyer</th></tr></thead><tbody>{loading ? <tr><td colSpan="6">Loading...</td></tr> : lots.map(l=><tr key={l.id}><td><div className="crop-cell"><span className={`crop-dot ${l.crop.toLowerCase()}`} /><b>{l.crop}</b><small>{l.id}</small></div></td><td>{l.quantity}</td><td><Badge>{l.grade}</Badge></td><td><Badge tone={l.status==='Reserved'?'blue':l.status==='In review'?'amber':'green'}>{l.status}</Badge></td><td><b>{l.price}</b></td><td className="muted">{l.buyer}</td></tr>)}</tbody></table></div></div> 
}
function FarmerDashboard({ setActive }) { return <><div className="welcome"><div><p className="eyebrow">Wednesday, 29 May 2024 <span className="live-dot" /> Live overview</p><h1>Good morning, Ramesh</h1><p className="subhead">Here&apos;s what&apos;s happening with your produce today.</p></div><button className="primary-button" onClick={() => setActive('Add Produce')}><Plus /> Add produce</button></div><div className="metrics"><Metric label="Available produce" value="2.5 tonnes" change="8.4% this month" icon={Wheat} tone="green" /><Metric label="Active orders" value="03" change="2 need attention" icon={ShoppingBag} tone="blue" /><Metric label="Expected earnings" value="₹42,800" change="12.6% this month" icon={ArrowUpRight} tone="amber" /><Metric label="Active shipments" value="01" change="Arriving today" icon={Truck} tone="violet" /></div><div className="dashboard-grid"><LotsTable /><div className="stack"><InsightCard /><QualityCard /></div><ShipmentCard /></div></> }
function MapPanel() { return <MapLeaflet shipmentId="SHP-001" /> }
function ShipmentsPage() { return <><div className="welcome"><div><p className="eyebrow">Logistics / Live tracking</p><h1>Track your shipment</h1><p className="subhead">Follow your produce from the farm to the buyer.</p></div><button className="outline-button"><CalendarDays /> Shipment history</button></div><MapPanel /><div className="shipment-bottom"><div className="card deviation"><div className="warning-icon">!</div><div><h3>Route deviation detected</h3><p>Vehicle is 19.69 km from the expected route.</p><b>Route recalculated · Estimated remaining distance: {shipment.distance}</b></div></div><div className="card shipment-stat"><span className="eyebrow">Vehicle status</span><strong>On route</strong><span className="muted">{shipment.vehicle} · ETA {shipment.eta}</span></div><div className="card shipment-stat"><span className="eyebrow">Current location</span><strong>Sonipat collection centre</strong><span className="muted">{shipment.distance} remaining</span></div></div></> }
function OrdersPage({ setActive }) { 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.list().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return <><div className="welcome"><div><p className="eyebrow">Orders / Live list</p><h1>My Orders</h1><p className="subhead">Track and manage your recent orders.</p></div></div>
    <div className="card lots-card">
      <SectionHeader title="Active Orders" />
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Order ID</th><th>Crop</th><th>Quantity</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7">Loading orders...</td></tr> : orders.map(o => (
              <tr key={o.id}>
                <td><b>{o.id}</b></td>
                <td><span className={`crop-dot ${(o.crop||'').toLowerCase()}`} /><b>{o.crop}</b></td>
                <td>{o.quantity}</td>
                <td><b>{o.amount}</b></td>
                <td><Badge tone={o.status==='In transit'?'blue':o.status==='Delivered'?'green':'amber'}>{o.status}</Badge></td>
                <td>{o.date}</td>
                <td>
                  <button className="text-button" onClick={() => setActive('Shipments')}>
                    Track <ArrowUpRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </> 
}
function AddProducePage({ setActive }) { 
  const [formData, setFormData] = useState({ name: 'Onion', quantity: '', price: '', location: '' });
  const handleSubmit = async () => {
    try {
      await lotService.create({
        name: formData.name,
        quantity: parseInt(formData.quantity, 10),
        price: parseFloat(formData.price),
        status: 'Available',
        grade: 'Grade A', // default
        farmer: { id: 1 } // mock farmer for now
      });
      setActive('Dashboard');
    } catch (e) {
      console.error(e);
      alert('Error creating lot');
    }
  };

  return <><div className="welcome"><div><p className="eyebrow">My lots / New listing</p><h1>Add your produce</h1><p className="subhead">List your harvest in a few simple steps.</p></div></div><div className="steps"><span className="current"><b>1</b> Produce details</span><i /><span><b>2</b> Photos</span><i /><span><b>3</b> Quality check</span><i /><span><b>4</b> Market insight</span><i /><span><b>5</b> Listed</span></div><div className="form-card card"><div className="form-section"><h2>Tell us about your harvest</h2><p className="muted">Basic details help buyers find your produce.</p><div className="form-grid"><label>Crop type<select value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})}><option>Onion</option><option>Potato</option><option>Tomato</option><option>Wheat</option></select></label><label>Available quantity<div className="input-unit"><input placeholder="500" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: e.target.value})} /><span>kg</span></div></label><label>Harvest date<input type="date" defaultValue="2024-05-27" /></label><label>Location<input placeholder="e.g. Panipat, Haryana" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} /></label><label>Expected price <small>Optional</small><div className="input-unit"><span>₹</span><input placeholder="2,700" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} /><span>/ qtl</span></div></label></div></div><div className="form-section"><h2>Upload photos of your produce</h2><p className="muted">Clear photos help our team assess visible quality. You can add up to 5 photos.</p><div className="upload-box"><div className="upload-icon"><Package /></div><b>Drop photos here or browse</b><span>JPG or PNG · up to 10 MB each</span><button className="outline-button">Choose photos</button></div></div><div className="form-footer"><button className="text-button" onClick={()=>setActive('Dashboard')}>Cancel</button><button className="primary-button" onClick={handleSubmit}>Continue to photos <ArrowUpRight /></button></div></div></> 
}
function BuyerDashboard({ setActive }) { return <><div className="welcome"><div><p className="eyebrow">Wednesday, 29 May 2024 <span className="live-dot" /> Procurement overview</p><h1>Good morning, FreshCart</h1><p className="subhead">Find the right produce and keep your supply moving.</p></div><button className="primary-button" onClick={()=>setActive('Find Produce')}><Search /> Find produce</button></div><div className="metrics"><Metric label="Active orders" value="08" change="3 arriving this week" icon={ShoppingBag} tone="blue" /><Metric label="Pending orders" value="03" change="Needs your review" icon={FileText} tone="amber" /><Metric label="Incoming shipments" value="04" change="On schedule" icon={Truck} tone="green" /><Metric label="Total procurement" value="₹8.4L" change="This month" icon={ArrowUpRight} tone="violet" /></div><div className="buyer-layout"><div className="card match-card"><SectionHeader title="Smart matches" action="See all matches" /><div className="match-requirement"><span className="ai-label"><Zap /> Best match for your requirement</span><b>1,000 kg Grade A Onion</b><p>Based on quality, quantity, price and distance.</p></div>{[['Farmer A','500 kg','20 km away'],['Farmer B','300 kg','24 km away'],['Farmer C','200 kg','31 km away']].map((m,i)=><div className="match-row" key={m[0]}><div className="farmer-avatar">{m[0].slice(-1)}</div><div><b>{m[0]}</b><span>{m[1]} · Grade A</span></div><small>{m[2]}</small><Badge tone={i===0?'green':'neutral'}>{i===0?'92% match':'Good fit'}</Badge></div>)}<button className="primary-button full">Review aggregated supply <ArrowUpRight /></button></div><div className="card intelligence-card"><SectionHeader title="Market intelligence" action="Open intelligence" /><div className="intelligence-head"><div><span className="eyebrow">Onion price forecast</span><strong>₹2,780 <small>/ qtl in 5 days</small></strong><p className="metric-change"><ArrowUpRight /> 6.9% expected increase</p></div><div className="chart-wrap"><MiniChart points={pricePoints} /></div></div><div className="demand-box"><MapPin /><div><b>Delhi onion demand</b><span>38 tonnes expected next 7 days</span></div><Badge tone="blue">High demand</Badge></div></div><div className="card produce-market"><SectionHeader title="Produce in the marketplace" action="View marketplace" /><div className="produce-grid">{produce.map(p=><div className="produce-card" key={p.crop}><div className={`produce-photo ${p.accent}`}><span>{p.crop[0]}</span></div><div className="produce-info"><div className="flex items-start justify-between"><div><h3>{p.crop}</h3><Badge>{p.grade}</Badge></div><span className="quality-mini">{p.score}/100</span></div><p><MapPin /> {p.location}</p><p>{p.quantity}</p><strong>{p.price}</strong><button className="outline-button full">View lot</button></div></div>)}</div></div></div></> }
function FindProducePage({ setActive }) { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    marketplaceService.getProducts({ search }).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => {
      setProducts(mockProduce); // fallback for now
      setLoading(false);
    });
  }, [search]);

  const handleOrder = async (p) => {
    try {
      await orderService.create({
        consumerId: 1, // mock consumer
        productId: p.id,
        quantity: parseInt(p.quantity.replace(/[^0-9]/g, ''), 10) || 500,
        pickupLocation: p.location,
        deliveryLocation: 'Delhi'
      });
      alert('Order placed successfully!');
      setActive('Orders');
    } catch (e) {
      alert('Failed to place order');
    }
  };

  return <><div className="welcome"><div><p className="eyebrow">Marketplace / Procurement</p><h1>Find produce</h1><p className="subhead">Source quality produce directly from verified farmers.</p></div></div><div className="search-row"><div className="search-box"><Search /><input placeholder="Search onion, potato, tomato..." value={search} onChange={e=>setSearch(e.target.value)} /></div><button className="filter-button"><ListFilter /> Filters</button><button className="filter-button">Sort: Recommended <ChevronDown /></button></div><div className="produce-grid large">{loading ? <p>Loading...</p> : products.map((p, i)=><div className="produce-card" key={p.id || p.crop+i}><div className={`produce-photo ${p.accent}`}><span>{p.crop[0]}</span><Badge tone="green">Verified lot</Badge></div><div className="produce-info"><div className="flex items-start justify-between"><div><h3>{p.crop}</h3><Badge>{p.grade}</Badge></div><div className="quality-mini"><Zap /> {p.score}/100</div></div><p>{p.quantity}</p><p><MapPin /> {p.location}</p><p><CalendarDays /> {p.harvest}</p><strong>{p.price}</strong><div className="card-actions"><button className="outline-button">View lot</button><button className="primary-button" onClick={() => handleOrder(p)}>Request / order</button></div></div></div>)}</div></> 
}
function IntelligencePage() { return <><div className="welcome"><div><p className="eyebrow">Insights / Market intelligence</p><h1>Market intelligence</h1><p className="subhead">Simple signals to help you buy with confidence.</p></div><button className="filter-button"><MapPin /> Delhi market <ChevronDown /></button></div><div className="intelligence-grid"><div className="card big-chart"><SectionHeader title="Onion price prediction" action="Last 30 days" /><div className="big-stat"><strong>₹2,600 <small>/ qtl</small></strong><Badge tone="green">+6.9% forecast</Badge></div><div className="chart-large"><MiniChart points={pricePoints} color="#477e53" /><div className="chart-labels"><span>24 May</span><span>Today</span><span>3 Jun</span><span>7 Jun</span></div></div><p className="chart-note"><Zap /> Forecast uses recent mandi prices and demand signals. It is an estimate, not a guarantee.</p></div><div className="card demand-card"><SectionHeader title="Demand forecast" /><div className="demand-number"><strong>38</strong><span>tonnes<br />next 7 days</span></div><MiniChart points={demandPoints} color="#d28d36" /><div className="demand-foot"><span>Delhi onion demand</span><Badge tone="amber">High demand</Badge></div></div></div></> }
export default function FarmLinkApp() { const [role,setRole]=useState('farmer'); const [active,setActive]=useState('Dashboard'); const content=role==='farmer'? (active==='Shipments'?<ShipmentsPage />:active==='Orders'?<OrdersPage setActive={setActive} />:active==='Add Produce'?<AddProducePage setActive={setActive} />:<FarmerDashboard setActive={setActive} />) : (active==='Find Produce'?<FindProducePage setActive={setActive} />:active==='Market Intelligence'?<IntelligencePage />:<BuyerDashboard setActive={setActive} />); return <div className="app-shell"><Sidebar role={role} active={active} setActive={setActive} /><div className="main-area"><Topbar role={role} setRole={r=>{setRole(r);setActive('Dashboard')}} /><main className="content">{content}</main><div className="mobile-nav">{(role==='farmer'?farmerNav:buyerNav).slice(0,4).map(item=>{const Icon=icons[item]??Package;return <button className={active===item?'active':''} key={item} onClick={()=>setActive(item)}><Icon /><span>{item==='Dashboard'?'Home':item.replace('My ','')}</span></button>})}</div></div></div> }
