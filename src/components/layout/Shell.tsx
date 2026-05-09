import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Target, 
  CheckSquare, 
  BarChart3, 
  LogOut, 
  LayoutDashboard,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { motion, AnimatePresence } from 'motion/react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Target },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const { profile, organization, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-neutral-300 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-[#0a0a0a] border-r border-neutral-800 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white font-bold">N</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">NexusCRM</h1>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-neutral-600 font-semibold mb-4 px-3">Management</div>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white border border-neutral-700/50 shadow-inner'
                      : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-neutral-800">
          <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl mb-4">
             <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Azure Instance</div>
             <div className="text-[10px] text-neutral-500 mt-1">Region: asia-southeast1</div>
          </div>
          <div className="flex items-center gap-3 px-2 py-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
            <Avatar className="w-8 h-8 border border-neutral-700">
              <AvatarImage src={profile?.photoURL} />
              <AvatarFallback className="bg-neutral-800 text-neutral-300">{profile?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white uppercase tracking-tight">
                {profile?.displayName}
              </p>
              <p className="text-[10px] text-neutral-500 truncate font-medium">
                {profile?.role?.replace('_', ' ')}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-neutral-500 hover:text-white hover:bg-neutral-800">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-neutral-800 md:hidden"
          >
            <div className="p-6">
               <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">N</div>
                  <h1 className="text-xl font-bold tracking-tight text-white">NexusCRM</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-500">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        isActive
                          ? 'bg-neutral-900 text-white border border-neutral-700/50'
                          : 'text-neutral-500 hover:bg-neutral-900'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-[#080808] border-b border-neutral-800 flex items-center justify-between px-4 md:px-8 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-neutral-400"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-neutral-500">Tenant:</span>
                <span className="text-white font-semibold truncate max-w-[120px] sm:max-w-none">{organization?.name}</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#050505]">
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
