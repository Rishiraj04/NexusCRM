import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Search,
  Loader2,
  Trash2,
  Phone,
  Mail,
  Building,
  Users,
  MoreVertical
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';

export default function Customers() {
  const { profile } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', company: '', email: '', phone: '', status: 'active' });

  useEffect(() => {
    if (!profile?.organizationId) return;
    const q = query(collection(db, 'organizations', profile.organizationId, 'customers'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile?.organizationId]);

  const handleAddCustomer = async () => {
    if (!newCustomer.name) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'organizations', profile.organizationId, 'customers'), {
        ...newCustomer,
        organizationId: profile.organizationId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddDialogOpen(false);
      setNewCustomer({ name: '', company: '', email: '', phone: '', status: 'active' });
      toast.success('Customer added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client record?')) return;
    try {
      await deleteDoc(doc(db, 'organizations', profile.organizationId, 'customers', id));
      toast.success('Client record purged');
    } catch (error) {
      console.error(error);
      toast.error('Failed to purge client record');
    }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-none">Client Portfolio</h1>
          <p className="text-neutral-500 mt-2 text-sm font-medium">Managing relationships with {customers.length} institutional entities.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 group h-11 px-6 rounded-xl font-bold text-sm">
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Onboard Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">Onboarding Parameters</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Full Identifier"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newCustomer.name}
                onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
              <Input
                placeholder="Corporate Entity"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newCustomer.company}
                onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })}
              />
              <Input
                placeholder="Primary Node (Email)"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newCustomer.email}
                onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
              <Input
                placeholder="Direct Link (Phone)"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newCustomer.phone}
                onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-neutral-500 hover:text-white">Abort</Button>
              <Button onClick={handleAddCustomer} className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Onboarding'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden min-h-[400px]">
        <div className="p-5 border-b border-neutral-900 flex flex-col sm:flex-row gap-4 items-center bg-[#0d0d0d]">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Query identifier or entity..."
              className="pl-11 h-11 bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder:text-neutral-600"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 bg-neutral-900/10">
            <h3 className="text-xl font-bold text-white tracking-tight italic">Null result set</h3>
            <p className="text-neutral-500 max-w-xs mx-auto mt-2 font-medium">Verify your query or initiate a manual contact record to populate the database.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-neutral-900 hover:bg-transparent bg-neutral-900/30">
                  <TableHead className="w-[300px] text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4 pl-8">Client signature</TableHead>
                  <TableHead className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4">Corporate entity</TableHead>
                  <TableHead className="hidden md:table-cell text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4">Status</TableHead>
                  <TableHead className="text-right text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className="group border-b border-neutral-900/50 hover:bg-neutral-900/40 transition-colors">
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-500 font-black shrink-0 shadow-inner group-hover:border-indigo-500 transition-colors">
                          {c.name?.[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 font-medium">
                          <p className="font-bold text-white truncate text-base tracking-tight">{c.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1 font-semibold uppercase tracking-wider">
                            <Mail className="w-3 h-3 text-neutral-600" />
                            <span className="truncate">{c.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
                        <Building className="w-3 h-3 text-neutral-600" />
                        {c.company}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Active Partner</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        className="h-9 w-9 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
