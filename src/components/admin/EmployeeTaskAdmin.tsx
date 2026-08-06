import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckSquare, 
  Plus, 
  Calendar, 
  Star, 
  Clock, 
  ShieldCheck, 
  Tag, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { EmployeeProfile, EnterpriseTask, UserRole, TaskStatus } from '../../types/enterprise';
import { fetchEmployees, saveEmployee, fetchTasks, saveTask } from '../../services/enterpriseDb';

export const EmployeeTaskAdmin: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [tasks, setTasks] = useState<EnterpriseTask[]>([]);
  const [activeTab, setActiveTab] = useState<'employees' | 'tasks'>('tasks');

  // New Employee Form
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState<UserRole>('Engineer');
  const [empDept, setEmpDept] = useState<'Architectural' | 'Structural' | 'BIM 3D' | 'Project Management' | 'Sales' | 'HR' | 'Finance'>('Structural');
  const [empSalary, setEmpSalary] = useState(120000);

  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Priya Verma');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('High');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const e = await fetchEmployees();
    const t = await fetchTasks();
    setEmployees(e);
    setTasks(t);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: EmployeeProfile = {
      id: `emp-${Date.now()}`,
      name: empName,
      email: empEmail,
      phone: '+91 98000 00000',
      role: empRole,
      department: empDept,
      joiningDate: new Date().toISOString().split('T')[0],
      monthlySalaryINR: empSalary,
      attendanceDaysThisMonth: 22,
      status: 'Active',
      performanceRating: 5
    };

    await saveEmployee(newEmp);
    setEmployees([...employees, newEmp]);
    setEmpName('');
    setEmpEmail('');
    alert('Employee profile added to Firebase!');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: EnterpriseTask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: taskDesc,
      assigneeName: taskAssignee,
      priority: taskPriority,
      status: 'To Do',
      dueDate: '2026-08-25',
      labels: ['Engineering', 'Design Review'],
      commentsCount: 0,
      attachmentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    await saveTask(newTask);
    setTasks([newTask, ...tasks]);
    setTaskTitle('');
    setTaskDesc('');
    alert('Task assigned to team member!');
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = { ...task, status: newStatus };
    await saveTask(updated);
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-white/10">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Employee & Kanban Task Management</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Staff roles (Super Admin, Engineer, BIM Specialist), attendance & Kanban workflows</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
              activeTab === 'tasks' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Kanban Task Board ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
              activeTab === 'employees' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Employee Directory ({employees.length})
          </button>
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <div className="space-y-6">
          {/* TASK CREATOR FORM */}
          <form onSubmit={handleCreateTask} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Assign New Task</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                required
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="Task Title (e.g. Check Slab Rebar Binding)"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
              <input
                type="text"
                required
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
                placeholder="Detailed Scope & Notes"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
              <select
                value={taskAssignee}
                onChange={e => setTaskAssignee(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              >
                {(employees || []).map(e => (
                  <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold cursor-pointer">
                Assign Task
              </button>
            </div>
          </form>

          {/* KANBAN BOARD (TO DO, IN PROGRESS, IN REVIEW, COMPLETED) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['To Do', 'In Progress', 'In Review', 'Completed'] as const).map(colStatus => {
              const colTasks = (tasks || []).filter(t => t.status === colStatus);
              return (
                <div key={colStatus} className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3 min-h-[350px]">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-bold text-white text-xs">{colStatus}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px]">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(colTasks || []).map(t => (
                      <div key={t.id} className="p-3.5 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-white text-xs">{t.title}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-400">
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-2">{t.description}</p>
                        <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500 border-t border-white/5">
                          <span>Assignee: <strong className="text-slate-300">{t.assigneeName}</strong></span>
                          <select
                            value={t.status}
                            onChange={e => handleUpdateTaskStatus(t.id, e.target.value as any)}
                            className="bg-slate-900 text-slate-300 rounded px-1.5 py-0.5 text-[10px]"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* EMPLOYEES LIST */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleCreateEmployee} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Add Employee Profile</h3>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={empName}
                onChange={e => setEmpName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input
                type="email"
                required
                value={empEmail}
                onChange={e => setEmpEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Role Permission</label>
              <select
                value={empRole}
                onChange={e => setEmpRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              >
                {(['Super Admin', 'Admin', 'Manager', 'Designer', 'Engineer', 'Employee'] as const).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monthly Salary (INR)</label>
              <input
                type="number"
                value={empSalary}
                onChange={e => setEmpSalary(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg">
              Save Employee Profile
            </button>
          </form>

          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Staff Directory & Payroll Overview</h3>
            <div className="space-y-3">
              {(employees || []).map(e => (
                <div key={e.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold text-sm">{e.name}</div>
                    <div className="text-slate-400 text-[10px]">{e.role} • {e.department} • {e.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-mono font-bold">₹{e.monthlySalaryINR.toLocaleString()}/mo</div>
                    <div className="text-slate-400 text-[10px]">Attendance: {e.attendanceDaysThisMonth} Days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
