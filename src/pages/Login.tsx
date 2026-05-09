import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-md p-10 bg-[#0a0a0a] border border-neutral-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        {/* Abstract background highlight */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full" />
        
        <div className="text-center mb-12 relative">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
              <span className="text-white text-2xl font-black">N</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-3">NexusCRM</h1>
            <p className="text-neutral-500 font-medium text-sm uppercase tracking-[0.2em]">Multi-Tenant Engine</p>
          </motion.div>
        </div>

        <div className="space-y-8 relative">
          <div className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl flex items-start gap-3">
             <div className="mt-0.5 p-1 bg-emerald-500/10 rounded">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             </div>
             <p className="text-xs text-neutral-400 leading-relaxed font-medium">
               Secure enterprise login via Azure AD integration enabled. Use Google OAuth for immediate tenant provisioning.
             </p>
          </div>

          <Button 
            onClick={login} 
            className="w-full h-14 bg-indigo-600 text-white hover:bg-indigo-500 text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-[0.98] rounded-xl"
          >
            <LogIn className="w-4 h-4" />
            Continue with Corporate ID
          </Button>

          <div className="grid grid-cols-2 gap-3 pt-4">
             <div className="p-4 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl flex flex-col items-center gap-1 hover:border-neutral-700 transition-colors cursor-default">
                <span className="text-white font-black text-lg">AZURE</span>
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Deployment</span>
             </div>
             <div className="p-4 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl flex flex-col items-center gap-1 hover:border-neutral-700 transition-colors cursor-default">
                <span className="text-white font-black text-lg">REDIS</span>
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Cache Active</span>
             </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[9px] text-neutral-700 font-bold uppercase tracking-[0.3em] font-mono">
          System v2.4.0 • Cluster Healthy
        </p>
      </div>
    </div>
  );
}
