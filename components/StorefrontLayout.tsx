
import React from 'react';
import { TenantConfig, CartItem } from '../types';

interface Props {
  tenant: TenantConfig;
  children: React.ReactNode;
  onAdminClick: () => void;
  onTenantSwitch: (tenant: string) => void;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateCartQuantity: (id: string, qty: number) => void;
  onCheckout: () => void;
}

const StorefrontLayout: React.FC<Props> = ({ 
  tenant, 
  children, 
  onAdminClick, 
  onTenantSwitch, 
  cart, 
  isCartOpen, 
  setIsCartOpen,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onCheckout
}) => {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white" style={{ '--primary-color': tenant.primaryColor } as React.CSSProperties}>
      <div className="bg-slate-900 text-white text-[10px] uppercase tracking-widest py-2 text-center font-medium">
        Wholesale Portal • Min. order quantities apply
      </div>

      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {tenant.menuItems.map((item, idx) => (
              <button key={idx} className="text-sm font-medium hover:text-gray-500 transition-colors uppercase tracking-widest text-[10px] font-bold">
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center">
             <h1 className="text-2xl font-serif tracking-tight" style={{ color: tenant.primaryColor }}>{tenant.name}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onAdminClick} className="text-[10px] border border-black px-2 py-1 hover:bg-black hover:text-white transition-all uppercase font-bold">Admin</button>
            <div className="flex items-center gap-4">
              <span className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                <svg className="w-6 h-6 group-hover:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-bounce">{cartCount}</span>}
              </span>
            </div>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-xl font-serif">Bulk Bag</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                     <p className="text-gray-400 font-serif">Your bulk bag is currently empty.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                      <div className="w-20 h-28 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden"><img src={item.images[0]} className="w-full h-full object-cover" /></div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-[10px] uppercase text-gray-400 mt-1">Min: {item.minQuantity} units</p>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center border rounded-lg bg-gray-50">
                              <button onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-400 hover:text-black">-</button>
                              <span className="px-2 text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-400 hover:text-black">+</button>
                           </div>
                           <button onClick={() => onRemoveFromCart(item.id)} className="text-[10px] uppercase font-bold text-red-300 hover:text-red-500 transition-colors">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center text-lg font-serif"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  <button onClick={onCheckout} className={`w-full py-5 text-white text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 ${tenant.settings.checkoutMode === 'PIX' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'}`}>
                    {tenant.settings.checkoutMode === 'PIX' ? 'Pay via PIX' : 'Confirm via WhatsApp'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
      <footer className="bg-gray-50 border-t py-20 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
             <h2 className="text-xl font-serif mb-6">{tenant.name}</h2>
             <p className="text-sm text-gray-500 max-w-sm leading-relaxed">{tenant.institutional.about}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-4 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
              {tenant.menuItems.map((item, idx) => <li key={idx} className="hover:text-black cursor-pointer">{item}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6">Wholesale</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li>{tenant.institutional.contactEmail}</li>
              <li>{tenant.institutional.whatsapp}</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
