import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Layers, 
  User, 
  Calendar, 
  AlertCircle, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Paperclip, 
  FileCode, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  File, 
  Tag, 
  Send,
  Eye
} from 'lucide-react';
import { 
  EnterpriseProject, 
  ClientFileRequest, 
  FileRequestCategory, 
  FileRequestPriority, 
  FileRequestAttachment 
} from '../../types/enterprise';
import { saveClientFileRequest } from '../../services/enterpriseDb';
import { DocumentPreviewModal, PreviewableDocument } from './DocumentPreviewModal';

interface NewFileRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: EnterpriseProject[];
  currentSelectedProject: EnterpriseProject | null;
  clientUid: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  onSuccess: (newRequest: ClientFileRequest) => void;
}

const CATEGORIES: { id: FileRequestCategory; label: string; icon: string }[] = [
  { id: 'Architectural Working Drawings', label: 'Architectural Working Drawings', icon: '🏛️' },
  { id: 'Structural & Foundation Specs', label: 'Structural & Foundation Specs', icon: '🏗️' },
  { id: '3D BIM Model & Exterior Renders', label: '3D BIM Model & Exterior Renders', icon: '🏢' },
  { id: 'MEP & Electrical Schematics', label: 'MEP & Electrical Schematics', icon: '⚡' },
  { id: 'Interior Fit-out & Material Palette', label: 'Interior Fit-out & Material Palette', icon: '🛋️' },
  { id: 'Site Survey & Soil Test Reports', label: 'Site Survey & Soil Test Reports', icon: '📐' },
  { id: 'Bill of Quantities (BOQ) & Costing', label: 'Bill of Quantities (BOQ) & Costing', icon: '📊' },
  { id: 'Municipal & Authority Permit Drawings', label: 'Municipal & Permit Drawings', icon: '📑' },
  { id: 'Change Order / Design Revision', label: 'Change Order / Design Revision', icon: '🔄' },
  { id: 'Other Document Brief', label: 'Other Document Brief', icon: '📝' }
];

const QUICK_TEMPLATES: { label: string; title: string; category: FileRequestCategory; priority: FileRequestPriority; description: string; deliverables: string[] }[] = [
  {
    label: 'Structural Rebar & Beam Spec',
    title: 'Reinforced Concrete Beam & Column Detail Submission',
    category: 'Structural & Foundation Specs',
    priority: 'Urgent',
    description: 'Please review our contractor requirement for 1st-floor cantilever beam rebar configuration (Fe500D) and column junction lap lengths. Include structural deflection check under NBC code loads.',
    deliverables: ['AutoCAD 2024 .DWG Detailed Section', 'Structural Calculation Note (PDF)', 'Rebar Bending Schedule']
  },
  {
    label: '3D Exterior Render Walkthrough',
    title: 'Modern Facade Lighting & Cladding 3D Visualization',
    category: '3D BIM Model & Exterior Renders',
    priority: 'High',
    description: 'Requesting 4K photorealistic architectural renderings for the front elevation night scene with warm brass sconces and Italian travertine dry-stone cladding.',
    deliverables: ['4K Ultra-HD Exterior Renders (PNG)', 'Material Specification Sheet', 'Revit 2024 .RVT Component Model']
  },
  {
    label: 'MEP & Plumbing Conduit Layout',
    title: 'Sanitary Drainage & Electrical Conduit Routing Brief',
    category: 'MEP & Electrical Schematics',
    priority: 'Medium',
    description: 'We need the coordinated MEP layout for the wet areas (ground floor kitchen and master en-suite bathrooms) to avoid slab core penetration conflicts.',
    deliverables: ['Coordinated MEP Drawing Sheet (PDF)', 'Plumbing Pipe Sizing Matrix', 'AutoCAD .DWG File']
  },
  {
    label: 'Interior Material Schedule',
    title: 'Living Room Flooring & Wall Cladding Specification',
    category: 'Interior Fit-out & Material Palette',
    priority: 'Medium',
    description: 'Submission of client-selected Italian Statuario marble tile dimensions and acoustic wood slat wall panels for the formal living room.',
    deliverables: ['Material Quantity BOQ (Sq.Ft)', 'Dry-Fix Installation Details', 'Vendor Specification Matrix']
  }
];

export const NewFileRequestModal: React.FC<NewFileRequestModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentSelectedProject,
  clientUid,
  clientName,
  clientEmail,
  clientPhone,
  onSuccess
}) => {
  // Selected Project
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    currentSelectedProject?.id || (projects.length > 0 ? projects[0].id : 'proj-general')
  );

  const selectedProj = projects.find(p => p.id === selectedProjectId) || currentSelectedProject || projects[0];

  // Assigned PM (derived from selected project's team or fallback to Eng. Fiza Hayat)
  const defaultPM = selectedProj?.assignedTeam?.[0] || {
    uid: 'emp-1',
    name: 'Eng. Fiza Hayat',
    role: 'Principal Architect'
  };

  const [assignedPMUid, setAssignedPMUid] = useState<string>(defaultPM.uid);
  const [assignedPMName, setAssignedPMName] = useState<string>(defaultPM.name);
  const [assignedPMRole, setAssignedPMRole] = useState<string>(defaultPM.role);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FileRequestCategory>('Architectural Working Drawings');
  const [priority, setPriority] = useState<FileRequestPriority>('Medium');
  const [targetDueDate, setTargetDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  
  // Deliverables requested tags
  const [deliverables, setDeliverables] = useState<string[]>([
    'AutoCAD 2024 .DWG File',
    'High-Resolution PDF Drawing Sheet'
  ]);
  const [customDeliverable, setCustomDeliverable] = useState('');

  // Attachments
  const [attachments, setAttachments] = useState<FileRequestAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Document Preview State
  const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const handlePreviewAttachment = (att: FileRequestAttachment) => {
    const doc: PreviewableDocument = {
      id: att.id,
      name: att.name,
      fileType: att.fileType,
      sizeBytes: att.sizeBytes,
      url: att.url,
      uploadedAt: att.uploadedAt,
      uploadedBy: clientName,
      category: category,
      projectTitle: selectedProj?.title,
      notes: description
    };
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleApplyTemplate = (tmpl: typeof QUICK_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setPriority(tmpl.priority);
    setDescription(tmpl.description);
    setDeliverables(tmpl.deliverables);
  };

  const handleAddDeliverable = () => {
    if (!customDeliverable.trim()) return;
    if (!deliverables.includes(customDeliverable.trim())) {
      setDeliverables([...deliverables, customDeliverable.trim()]);
    }
    setCustomDeliverable('');
  };

  const handleRemoveDeliverable = (item: string) => {
    setDeliverables(deliverables.filter(d => d !== item));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: FileRequestAttachment[] = Array.from(files).map((f, idx) => {
      const ext = f.name.split('.').pop()?.toLowerCase() || 'file';
      let fileType: FileRequestAttachment['fileType'] = 'pdf';
      if (['dwg', 'dxf'].includes(ext)) fileType = 'dwg';
      else if (['rvt', 'rfa'].includes(ext)) fileType = 'rvt';
      else if (['docx', 'doc'].includes(ext)) fileType = 'docx';
      else if (['png'].includes(ext)) fileType = 'png';
      else if (['jpg', 'jpeg'].includes(ext)) fileType = 'jpg';
      else if (['zip', 'rar', '7z'].includes(ext)) fileType = 'zip';
      else if (['ifc'].includes(ext)) fileType = 'ifc';

      return {
        id: `att-${Date.now()}-${idx}`,
        name: f.name,
        sizeBytes: f.size,
        fileType,
        url: URL.createObjectURL(f),
        uploadedAt: new Date().toISOString().split('T')[0]
      };
    });

    setAttachments([...attachments, ...newAttachments]);
  };

  const handleAddSampleFiles = () => {
    const samples: FileRequestAttachment[] = [
      {
        id: `att-${Date.now()}-1`,
        name: 'Client_Site_Requirement_Brief.pdf',
        sizeBytes: 1850000,
        fileType: 'pdf',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date().toISOString().split('T')[0]
      },
      {
        id: `att-${Date.now()}-2`,
        name: 'Structural_Markup_Sketch.png',
        sizeBytes: 2400000,
        fileType: 'png',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
        uploadedAt: new Date().toISOString().split('T')[0]
      }
    ];
    setAttachments([...attachments, ...samples]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a descriptive title for your requirement brief.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide the detailed scope / requirement description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReq: ClientFileRequest = {
        id: `freq-${Date.now()}`,
        projectId: selectedProj?.id || 'proj-general',
        projectTitle: selectedProj?.title || 'General Engineering Consultation',
        clientUid: clientUid || 'client-user',
        clientName: clientName || 'Authenticated Client',
        clientEmail: clientEmail || 'client@example.com',
        clientPhone: clientPhone || '',
        assignedManagerUid: assignedPMUid,
        assignedManagerName: assignedPMName,
        assignedManagerRole: assignedPMRole,
        assignedManagerEmail: 'contact@fizahayat.com',
        assignedManagerAvatar: assignedPMName.includes('Fiza')
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        title: title.trim(),
        category,
        priority,
        targetDueDate,
        description: description.trim(),
        deliverablesRequested: deliverables,
        attachments,
        status: 'Submitted',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderUid: clientUid || 'client-user',
            senderName: clientName || 'Client',
            senderRole: 'Client',
            text: `Initial Requirement Document submitted to ${assignedPMName}. Attached ${attachments.length} reference file(s).`,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      await saveClientFileRequest(newReq);
      onSuccess(newReq);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit file request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Submit Project Requirement Document
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  File Request
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Submit architectural briefs, drawing requests & specifications directly to your assigned Project Manager.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {formError && (
            <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Quick Preset Templates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Requirement Templates:</span>
              </span>
              <span className="text-slate-500 text-[11px]">Click to auto-fill</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-blue-950/60 border border-white/10 text-slate-300 hover:text-blue-300 text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: PROJECT & ASSIGNED PM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 p-4 rounded-2xl border border-white/5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Project <span className="text-blue-400">*</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={e => {
                  setSelectedProjectId(e.target.value);
                  const p = projects.find(proj => proj.id === e.target.value);
                  if (p?.assignedTeam?.[0]) {
                    setAssignedPMUid(p.assignedTeam[0].uid);
                    setAssignedPMName(p.assignedTeam[0].name);
                    setAssignedPMRole(p.assignedTeam[0].role);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Assigned Project Manager Card */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Assigned Project Manager / Architect
              </label>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-blue-500/20 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold">
                    {assignedPMName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{assignedPMName}</div>
                    <div className="text-blue-400 text-[10px]">{assignedPMRole}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                  Assigned Lead
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: BRIEF TITLE & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">
                Requirement Brief Subject / Title <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 2nd Floor Master Balcony Rebar & Glass Railing Specs"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Category <span className="text-blue-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FileRequestCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PRIORITY & TARGET DUE DATE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Medium', 'High', 'Urgent'] as FileRequestPriority[]).map(p => {
                  const isSelected = priority === p;
                  let colorClasses = 'border-white/10 text-slate-400 bg-slate-950';
                  if (isSelected) {
                    if (p === 'Urgent') colorClasses = 'border-red-500 bg-red-950/60 text-red-300 font-bold';
                    else if (p === 'High') colorClasses = 'border-amber-500 bg-amber-950/60 text-amber-300 font-bold';
                    else if (p === 'Medium') colorClasses = 'border-blue-500 bg-blue-950/60 text-blue-300 font-bold';
                    else colorClasses = 'border-slate-500 bg-slate-800 text-white font-bold';
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${colorClasses}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Timeline / Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDueDate}
                  onChange={e => setTargetDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* DETAILED SCOPE / DESCRIPTION */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Detailed Requirement Scope & Technical Specifications <span className="text-blue-400">*</span>
              </label>
              <span className="text-slate-500 text-[10px]">{description.length} characters</span>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the architectural dimensions, load requirements, material choices, or specific site constraints your Project Manager needs to fulfill..."
              className="w-full px-3.5 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* DELIVERABLES REQUESTED CHECKLIST BUILDER */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">
              Specific Deliverables Requested from PM:
            </label>
            <div className="flex flex-wrap gap-2">
              {deliverables.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-200 text-[11px] font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3 text-blue-400" />
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(item)}
                    className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Deliverable Tag */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customDeliverable}
                onChange={e => setCustomDeliverable(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
                placeholder="Add deliverable format (e.g. 3D Walkthrough Video, Material BOQ)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* ATTACHMENT UPLOAD ZONE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">
                Attach Requirement Documents, Sketches or Reference CAD/PDFs
              </label>
              <button
                type="button"
                onClick={handleAddSampleFiles}
                className="text-blue-400 hover:text-blue-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Load Sample Reference Docs
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  const fakeEvent = { target: { files: e.dataTransfer.files } } as any;
                  handleFileUpload(fakeEvent);
                }
              }}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-2 cursor-pointer ${
                isDragging ? 'border-blue-500 bg-blue-950/30' : 'border-white/10 hover:border-blue-500/50 bg-slate-950/50'
              }`}
              onClick={() => document.getElementById('file-req-upload-input')?.click()}
            >
              <input
                id="file-req-upload-input"
                type="file"
                multiple
                accept=".pdf,.dwg,.dxf,.rvt,.docx,.doc,.png,.jpg,.jpeg,.zip,.ifc"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-bold">Click to browse</span> or drag and drop requirement documents here
              </div>
              <p className="text-slate-500 text-[10px]">
                Supported: PDF, AutoCAD (.DWG/.DXF), Revit (.RVT), Word (.DOCX), Images (PNG/JPG), IFC & ZIP archives
              </p>
            </div>

            {/* Uploaded Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 font-semibold text-[11px]">
                  Attached Documents ({attachments.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachments.map(att => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between group"
                    >
                      <div 
                        onClick={() => handlePreviewAttachment(att)}
                        className="flex items-center space-x-2 truncate cursor-pointer flex-1"
                      >
                        <div className="p-1.5 rounded-lg bg-blue-950 text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                          <Paperclip className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="text-white font-medium truncate text-[11px] group-hover:text-blue-300 transition-colors">
                            {att.name}
                          </div>
                          <div className="text-slate-400 text-[10px]">
                            {att.fileType.toUpperCase()} • {formatFileSize(att.sizeBytes)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewAttachment(att)}
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Remove Attachment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Document is dispatched immediately to your Project Manager's queue.</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting Brief...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Requirement Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* DOCUMENT PREVIEW MODAL OVERLAY */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={previewDoc}
          allDocuments={attachments.map(a => ({
            id: a.id,
            name: a.name,
            fileType: a.fileType,
            sizeBytes: a.sizeBytes,
            url: a.url,
            uploadedAt: a.uploadedAt,
            uploadedBy: clientName,
            category: category,
            projectTitle: selectedProj?.title,
            notes: description
          }))}
          onSelectDocument={(doc) => setPreviewDoc(doc)}
        />
      )}
    </div>
  );
};
