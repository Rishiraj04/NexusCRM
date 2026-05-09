import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Plus, Calendar, Clock, AlertCircle, Trash2, Loader2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Tasks() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile?.organizationId) return;
    const q = query(collection(db, 'organizations', profile.organizationId, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error(error);
    });
    return () => unsubscribe();
  }, [profile?.organizationId]);

  const addTask = async () => {
    if (!newTask) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'organizations', profile.organizationId, 'tasks'), {
        title: newTask,
        status: 'todo',
        organizationId: profile.organizationId,
        assignedTo: profile.uid,
        createdAt: serverTimestamp()
      });
      setNewTask('');
      toast.success('Task logged');
    } catch (e) {
      console.error(e);
      toast.error('Logging failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (task: any) => {
    try {
      await updateDoc(doc(db, 'organizations', profile.organizationId, 'tasks', task.id), {
        status: task.status === 'completed' ? 'todo' : 'completed'
      });
    } catch (e) {
      console.error(e);
      toast.error('Sync failed');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'organizations', profile.organizationId, 'tasks', id));
      toast.success('Record purged');
    } catch (e) {
      console.error(e);
      toast.error('Purge failed');
    }
  };

  return (
    <div className="space-y-8 max-w-[1000px] mx-auto min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white leading-none">Operational Queue</h1>
          <p className="text-neutral-500 mt-2 text-sm font-medium">Tracking {tasks.length} active coordination markers.</p>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Log new operational task..."
            className="w-full sm:w-[300px] bg-[#0a0a0a] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-indigo-500 transition-colors h-11 px-4 rounded-xl shadow-inner"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} disabled={loading} className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 h-11 px-6 rounded-xl font-bold transition-all active:scale-95">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit'}
          </Button>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="text-center py-32 bg-neutral-900/10">
            <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="w-10 h-10 text-neutral-700" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight italic">Null active tasks</h3>
            <p className="text-neutral-500 mt-2 max-w-xs mx-auto font-medium">Your current workflow is clear. Enjoy the operational downtime.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-900">
            {tasks.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map(task => (
              <div key={task.id} className="group flex items-center gap-4 p-6 hover:bg-neutral-900/30 transition-colors">
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={() => toggleTask(task)}
                  className="w-5 h-5 border-neutral-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-md transition-all scale-110"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold tracking-tight transition-all ${task.status === 'completed' ? 'text-neutral-600 line-through' : 'text-neutral-200'
                    }`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 font-bold uppercase tracking-widest text-[9px]">
                    <span className="text-neutral-600">ID: #{task.id.slice(0, 4)}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-800" />
                    <span className="flex items-center gap-1 text-indigo-400 opacity-60"><Clock className="w-2.5 h-2.5" /> Synchronized</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 h-9 w-9 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-indigo-600/10 blur-2xl rounded-full group-hover:bg-indigo-600/20 transition-colors" />
          <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Sync efficiency</h4>
          <div className="text-2xl font-black text-white italic">
            {Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}%
          </div>
        </div>
        <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
          <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Active backlog</h4>
          <div className="text-2xl font-black text-white italic">
            {tasks.filter(t => t.status !== 'completed').length} items
          </div>
        </div>
        <div className="p-6 bg-emerald-600/5 border border-emerald-500/10 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-emerald-600/10 blur-2xl rounded-full group-hover:bg-emerald-600/20 transition-colors" />
          <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">System Health</h4>
          <div className="text-2xl font-black text-white italic">
            Stable (A+)
          </div>
        </div>
      </div>
    </div>
  );
}
