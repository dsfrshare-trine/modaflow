
import React, { useState, useRef, useMemo } from 'react';
import { MOCK_TENANTS, MOCK_PRODUCTS, MOCK_ORDERS } from './constants';
import { TenantConfig, Product, Order, CartItem } from './types';
import StorefrontLayout from './components/StorefrontLayout';
import AdminLayout from './components/AdminLayout';
import { generateProductDescription } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (p: Product, q: number) => void;
}> = ({ product, onAddToCart }) => {
  const [qty, setQty] = useState(product.minQuantity);

  return (
    <div className="group relative">
      <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-6 relative">
        <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
          Min {product.minQuantity}
        </div>
        <img src={product.images[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
      </div>
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{product.category}</p>
        <h4 className="font-medium text-base text-gray-900">{product.name}</h4>
        <p className="text-sm font-bold text-indigo-600">${product.price.toFixed(2)} <span className="text-gray-400 text-[10px] font-normal">/ unit</span></p>
        <div className="pt-4 flex items-center gap-3">
          <div className="flex border rounded-lg overflow-hidden bg-gray-50">
            <button onClick={() => setQty(Math.max(product.minQuantity, qty - 1))} className="px-3 py-2 hover:bg-gray-200 transition-colors text-gray-500 font-bold">-</button>
            <input type="number" value={qty} onChange={(e) => setQty(Math.max(product.minQuantity, parseInt(e.target.value) || product.minQuantity))} className="w-12 text-center bg-transparent text-xs font-bold focus:outline-none" />
            <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-gray-200 transition-colors text-gray-500 font-bold">+</button>
          </div>
          <button onClick={() => onAddToCart(product, qty)} className="flex-1 bg-black text-white text-[10px] uppercase font-bold tracking-widest py-3 hover:bg-indigo-600 transition-all rounded-lg">Add To Request</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentTenant, setCurrentTenant] = useState<TenantConfig>(MOCK_TENANTS[0]);
  const [activeAdminView, setActiveAdminView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('month');

  // Admin temporary states
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', description: '', imageUrl: '', minQty: '10' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tenantProducts = useMemo(() => products.filter(p => p.tenantId === currentTenant.id), [products, currentTenant.id]);
  const tenantOrders = useMemo(() => orders.filter(o => o.tenantId === currentTenant.id), [orders, currentTenant.id]);

  const dashboardData = useMemo(() => {
    const paidOrders = tenantOrders.filter(o => o.status === 'PAID');
    const pendingOrders = tenantOrders.filter(o => o.status === 'PENDING');
    
    const paidRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0);
    const totalItemsSold = tenantOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    // Simulated Weekly/Monthly Chart
    const chartData = [
      { name: 'Week 1', paid: 4000, pending: 2400 },
      { name: 'Week 2', paid: 3000, pending: 1398 },
      { name: 'Week 3', paid: 2000, pending: 9800 },
      { name: 'Week 4', paid: 2780, pending: 3908 },
    ];

    // Top Selling Items (Simulated based on orders)
    const productSales: Record<string, number> = {};
    tenantOrders.forEach(o => o.items.forEach(i => {
      productSales[i.productId] = (productSales[i.productId] || 0) + i.quantity;
    }));
    const topItems = Object.entries(productSales)
      .map(([id, qty]) => ({ name: products.find(p => p.id === id)?.name || 'Product', value: qty }))
      .sort((a, b) => b.value - a.value);

    return { paidRevenue, pendingRevenue, totalItemsSold, orderCount: tenantOrders.length, chartData, topItems };
  }, [tenantOrders, products]);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, newQty: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(item.minQuantity, newQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      tenantId: currentTenant.id,
      customerName: "Bulk Client",
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price }))
    };
    setOrders(prev => [newOrder, ...prev]);

    if (currentTenant.settings.checkoutMode === 'WHATSAPP') {
      const itemsList = cart.map(i => `📦 ${i.name} (${i.quantity} units)`).join('%0A');
      const msg = `Bulk Request ${newOrder.id}%0A%0A${itemsList}%0A%0ATotal: $${newOrder.total.toFixed(2)}`;
      window.open(`https://wa.me/${currentTenant.institutional.whatsapp}?text=${msg}`, '_blank');
    } else {
      alert(`PIX Payment Instructions for ${newOrder.id}:\n\nKey: ${currentTenant.settings.pixKey}\nValue: $${newOrder.total.toFixed(2)}`);
    }
    setCart([]);
    setIsCartOpen(false);
  };

  // Fix for error in App.tsx on line 367: Cannot find name 'updateOrderStatus'.
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // Fix for error in App.tsx on line 380: Cannot find name 'handleTenantSwitch'.
  const handleTenantSwitch = (tenantSlug: string) => {
    const tenant = MOCK_TENANTS.find(t => t.slug === tenantSlug);
    if (tenant) {
      setCurrentTenant(tenant);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h3 className="text-xl font-bold text-slate-800">Operational Overview</h3>
         <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['week', 'month', 'year'] as const).map(f => (
              <button key={f} onClick={() => setTimeFilter(f)} className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${timeFilter === f ? 'bg-white shadow text-indigo-600' : 'text-slate-400'}`}>{f}</button>
            ))}
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Confirmed Revenue</p>
          <h4 className="text-2xl font-black text-slate-900">${dashboardData.paidRevenue.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Pending Value</p>
          <h4 className="text-2xl font-black text-amber-600">${dashboardData.pendingRevenue.toFixed(2)}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Items Distributed</p>
          <h4 className="text-2xl font-black text-indigo-600">{dashboardData.totalItemsSold}</h4>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Requests</p>
          <h4 className="text-2xl font-black text-slate-900">{dashboardData.orderCount}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-100">
           <h4 className="text-sm font-bold text-slate-800 mb-6">Financial Conversion ({timeFilter})</h4>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={dashboardData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="paid" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="pending" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
           <h4 className="text-sm font-bold text-slate-800 mb-6">Volume Leaderboard</h4>
           <div className="space-y-4">
              {dashboardData.topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                   <p className="text-xs font-bold text-slate-600">{item.name}</p>
                   <span className="text-[10px] font-black bg-white px-2 py-1 rounded-lg border border-slate-100">{item.value} units</span>
                </div>
              ))}
              {dashboardData.topItems.length === 0 && <p className="text-center text-xs text-slate-400 py-10">No volume data yet.</p>}
           </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 pb-20">
       <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Branding & Menu</h3>
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Store Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={currentTenant.name} onChange={e => setCurrentTenant({...currentTenant, name: e.target.value})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation Labels</label>
                <div className="flex gap-2">
                   <input type="text" placeholder="Add menu item..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newMenuLabel} onChange={e => setNewMenuLabel(e.target.value)} onKeyPress={e => e.key === 'Enter' && (setCurrentTenant({...currentTenant, menuItems: [...currentTenant.menuItems, newMenuLabel]}), setNewMenuLabel(''))} />
                   <button onClick={() => {if(newMenuLabel){setCurrentTenant({...currentTenant, menuItems: [...currentTenant.menuItems, newMenuLabel]}); setNewMenuLabel('');}}} className="px-6 bg-indigo-600 text-white rounded-xl font-bold">+</button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                   {currentTenant.menuItems.map((item, idx) => (
                     <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold flex items-center gap-2">
                       {item}
                       <button onClick={() => setCurrentTenant({...currentTenant, menuItems: currentTenant.menuItems.filter((_, i) => i !== idx)})} className="text-red-300">×</button>
                     </span>
                   ))}
                </div>
             </div>
          </div>
       </div>

       <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Checkout Configuration</h3>
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checkout Strategy</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={currentTenant.settings.checkoutMode} onChange={e => setCurrentTenant({...currentTenant, settings: {...currentTenant.settings, checkoutMode: e.target.value as any}})}>
                   <option value="WHATSAPP">Direct WhatsApp Lead</option>
                   <option value="PIX">Instant PIX Payment</option>
                </select>
             </div>
             {currentTenant.settings.checkoutMode === 'PIX' && (
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PIX Key</label>
                   <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={currentTenant.settings.pixKey} onChange={e => setCurrentTenant({...currentTenant, settings: {...currentTenant.settings, pixKey: e.target.value}})} />
                </div>
             )}
          </div>
       </div>

       <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-8">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-4">Visual Appearance</h3>
          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hero Background Image URL</label>
             <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={currentTenant.banners.heroImageUrl} onChange={e => setCurrentTenant({...currentTenant, banners: {...currentTenant.banners, heroImageUrl: e.target.value}})} />
             <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hero Title</label>
                   <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={currentTenant.banners.heroTitle} onChange={e => setCurrentTenant({...currentTenant, banners: {...currentTenant.banners, heroTitle: e.target.value}})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Brand Color</label>
                   <div className="flex gap-4 items-center">
                      <input type="color" className="h-10 w-20 rounded-lg cursor-pointer" value={currentTenant.primaryColor} onChange={e => setCurrentTenant({...currentTenant, primaryColor: e.target.value})} />
                      <span className="text-xs font-mono text-slate-400 uppercase">{currentTenant.primaryColor}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {isAddingProduct ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-2xl mx-auto">
          <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Add Wholesale Item</h3>
            <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-red-500">×</button>
          </div>
          <div className="p-10 space-y-6">
             <div className="grid grid-cols-2 gap-6">
                <input type="text" placeholder="Product Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input type="number" placeholder="Unit Price" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <input type="number" placeholder="Min. Order Quantity" className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" value={newProduct.minQty} onChange={e => setNewProduct({...newProduct, minQty: e.target.value})} />
                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                   <option value="">Select Segment...</option>
                   {currentTenant.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <button onClick={() => {
                const p: Product = {
                  id: `p-${Date.now()}`,
                  tenantId: currentTenant.id,
                  name: newProduct.name,
                  description: newProduct.description,
                  price: parseFloat(newProduct.price),
                  category: newProduct.category,
                  images: [newProduct.imageUrl || 'https://picsum.photos/400/600'],
                  sizes: ['S','M','L'],
                  stock: 999,
                  minQuantity: parseInt(newProduct.minQty) || 10
                };
                setProducts([...products, p]);
                setIsAddingProduct(false);
             }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest">Commit to Catalogue</button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-8 border-b flex justify-between items-center">
              <h3 className="font-bold text-xl text-slate-800">Master Inventory</h3>
              <button onClick={() => setIsAddingProduct(true)} className="px-6 py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl">+ New Reference</button>
           </div>
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b">
                 <th className="px-8 py-5">Item</th>
                 <th className="px-8 py-5">Min. Bulk</th>
                 <th className="px-8 py-5">Unit Cost</th>
                 <th className="px-8 py-5 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {tenantProducts.map(p => (
                 <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-8 py-6 flex items-center gap-4">
                       <img src={p.images[0]} className="w-10 h-14 rounded object-cover" />
                       <span className="text-sm font-bold text-slate-900">{p.name}</span>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-indigo-600">{p.minQuantity} units</td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-900">${p.price.toFixed(2)}</td>
                    <td className="px-8 py-6 text-right">
                       <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-xs text-red-300 hover:text-red-500 font-bold">Remove</button>
                    </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {isAdminMode ? (
        <AdminLayout tenant={currentTenant} onExit={() => setIsAdminMode(false)} activeView={activeAdminView} setActiveView={setActiveAdminView}>
          {activeAdminView === 'dashboard' && renderDashboard()}
          {activeAdminView === 'settings' && renderSettings()}
          {activeAdminView === 'products' && renderProducts()}
          {activeAdminView === 'orders' && (
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b">
                         <th className="px-6 py-4">Request ID</th>
                         <th className="px-6 py-4">Total</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4 text-right">Confirm</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {tenantOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/50">
                           <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                           <td className="px-6 py-4 text-sm font-bold">${o.total.toFixed(2)}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <input type="checkbox" checked={o.status === 'PAID'} onChange={(e) => updateOrderStatus(o.id, e.target.checked ? 'PAID' : 'PENDING')} className="w-4 h-4 text-indigo-600 rounded" />
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </AdminLayout>
      ) : (
        <StorefrontLayout 
          tenant={currentTenant} 
          onAdminClick={() => setIsAdminMode(true)}
          onTenantSwitch={handleTenantSwitch}
          cart={cart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          onRemoveFromCart={removeFromCart}
          onUpdateCartQuantity={updateCartQuantity}
          onCheckout={handleCheckout}
        >
          <section className="relative h-[60vh] overflow-hidden">
            <img src={currentTenant.banners.heroImageUrl} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" alt="Hero" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-white text-5xl md:text-7xl font-serif mb-6 drop-shadow-lg max-w-4xl">{currentTenant.banners.heroTitle}</h2>
              <p className="text-white text-lg md:text-xl font-light mb-10 tracking-widest max-w-xl uppercase">{currentTenant.banners.heroSubtitle}</p>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white text-[10px] uppercase font-bold tracking-[0.2em]">
                Wholesale Portal • Professional Inventory
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {tenantProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={addToCart} />)}
            </div>
          </section>
        </StorefrontLayout>
      )}
    </div>
  );
};

export default App;
