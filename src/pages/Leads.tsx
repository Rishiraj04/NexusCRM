import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import {
  Plus,
  Search,
  MoreVertical,
  Filter,
  Package,
  Building2,
  Mail,
  Loader2,
  Trash2,
  Edit
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const leadStages = ["New Lead", "Contacted", "Qualified", "Negotiation", "Converted", "Lost"];

export default function Leads() {
  const { profile, organization } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', email: '', stage: 'New Lead' });

  useEffect(() => {
    if (!profile?.organizationId) return;

    const q = query(
      collection(db, 'organizations', profile.organizationId, 'leads')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.organizationId]);

  const handleAddLead = async () => {
    if (!newLead.name) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'organizations', profile.organizationId, 'leads'), {
        ...newLead,
        organizationId: profile.organizationId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        assignedTo: profile.uid
      });
      setIsAddDialogOpen(false);
      setNewLead({ name: '', company: '', email: '', stage: 'New Lead' });
      toast.success('Lead added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (leadId: string, newStage: string) => {
    try {
      await updateDoc(doc(db, 'organizations', profile.organizationId, 'leads', leadId), {
        stage: newStage,
        updatedAt: serverTimestamp()
      });
      toast.success('Lead stage updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update stage');
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteDoc(doc(db, 'organizations', profile.organizationId, 'leads', leadId));
      toast.success('Lead deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete lead');
    }
  };

  const filteredLeads = leads.filter(l =>
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-none">Pipeline Management</h1>
          <p className="text-neutral-500 mt-2 text-sm font-medium">Tracking {leads.length} active opportunities across organization.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger>
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 group h-11 px-6 rounded-xl font-bold text-sm">
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Ingest New Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">Lead Parameters</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Subject Name"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newLead.name}
                onChange={e => setNewLead({ ...newLead, name: e.target.value })}
              />
              <Input
                placeholder="Entity / Company"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newLead.company}
                onChange={e => setNewLead({ ...newLead, company: e.target.value })}
              />
              <Input
                placeholder="Contact Vector (Email)"
                type="email"
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors"
                value={newLead.email}
                onChange={e => setNewLead({ ...newLead, email: e.target.value })}
              />
              <Select value={newLead.stage} onValueChange={val => setNewLead({ ...newLead, stage: val })}>
                <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                  <SelectValue placeholder="Pipeline Stage" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                  {leadStages.map(stage => (
                    <SelectItem key={stage} value={stage} className="hover:bg-indigo-600 focus:bg-indigo-600">{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-neutral-500 hover:text-white hover:bg-neutral-900">Abort</Button>
              <Button onClick={handleAddLead} className="bg-indigo-600 text-white hover:bg-indigo-500 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Lead'}
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
              placeholder="Filter by name or company..."
              className="pl-11 h-11 bg-neutral-900 border-neutral-800 focus:ring-1 focus:ring-indigo-500/50 text-white placeholder:text-neutral-600"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="icon" className="h-11 w-11 bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-32 bg-neutral-900/10">
            <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-neutral-700" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Null data set detected</h3>
            <p className="text-neutral-500 max-w-xs mx-auto mt-2 font-medium">Please initiate a manual entry or ingest leads from your connected marketing channels.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-neutral-900 hover:bg-transparent bg-neutral-900/30">
                  <TableHead className="w-[300px] text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4 pl-8">Lead record</TableHead>
                  <TableHead className="text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4">Pipeline stage</TableHead>
                  <TableHead className="hidden md:table-cell text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4">Ownership</TableHead>
                  <TableHead className="text-right text-neutral-500 font-bold uppercase tracking-widest text-[10px] py-4 pr-8">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="group border-b border-neutral-900/50 hover:bg-neutral-900/40 transition-colors">
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-500 font-bold shrink-0 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                          {lead.name?.[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate tracking-tight text-base">{lead.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1 font-semibold uppercase tracking-wider">
                            <Building2 className="w-3 h-3 text-neutral-600" />
                            <span className="truncate">{lead.company || 'Confidential'}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="outline" size="sm" className="h-8 text-[11px] px-3 gap-2 font-bold transition-all bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white uppercase tracking-wider">
                            <span className={`w-1.5 h-1.5 rounded-full ${lead.stage === 'Converted' ? 'bg-emerald-500' :
                                lead.stage === 'Lost' ? 'bg-red-500' : 'bg-indigo-500'
                              }`} />
                            {lead.stage}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="bg-[#0d0d0d] border-neutral-800 text-white">
                          {leadStages.map(stage => (
                            <DropdownMenuItem key={stage} onSelect={() => updateStage(lead.id, stage)} className="text-xs focus:bg-indigo-600">
                              {stage}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/20">ME</div>
                        <span className="text-xs text-neutral-400 font-medium">Internal Admin</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-600 hover:text-white hover:bg-neutral-800">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#0d0d0d] border-neutral-800 text-white">
                          <DropdownMenuItem className="text-indigo-400 cursor-pointer focus:bg-indigo-600 focus:text-white">
                            <Mail className="w-4 h-4 mr-2" />
                            Initiate Outreach
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-red-400 cursor-pointer focus:bg-red-600 focus:text-white">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Purge Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
