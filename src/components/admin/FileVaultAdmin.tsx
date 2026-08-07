import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Download, 
  Upload, 
  Eye, 
  Shield, 
  FileCode, 
  Film, 
  Image as ImageIcon, 
  Sparkles, 
  Check 
} from 'lucide-react';
import { StorageFileItem } from '../../types/enterprise';

export const FileVaultAdmin: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<'Drawings' | '3D Models' | 'Invoices' | 'Contracts' | 'General'>('Drawings');
  const [files, setFiles] = useState<StorageFileItem[]>([
    { id: 'f-1', name: 'Master_Architectural_FloorPlan_v3.dwg', folder: 'Drawings', fileType: 'dwg', sizeBytes: 14500000, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', version: 3, uploadedBy: 'Eng. Fiza Hayat', createdAt: '2026-08-01' },
    { id: 'f-2', name: 'Villa_Exterior_3D_BIM_Model.rvt', folder: '3D Models', fileType: 'rvt', sizeBytes: 128000000, url: '#', version: 1, uploadedBy: 'Rohan Mehta', createdAt: '2026-08-03' },
    { id: 'f-3', name: 'Client_Construction_Contract_Signed.pdf', folder: 'Contracts', fileType: 'pdf', sizeBytes: 2400000, url: '#', version: 1, uploadedBy: 'Legal Dept', createdAt: '2026-07-28' }
  ]);

  const [newFileName, setNewFileName] = useState('');

  const handleUploadSimulatedFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newF: StorageFileItem = {
      id: `file-${Date.now()}`,
      name: newFileName,
      folder: activeFolder,
      fileType: 'pdf',
      sizeBytes: 3500000,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      version: 1,
      uploadedBy: 'Eng. Fiza Hayat',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFiles([newF, ...files]);
    setNewFileName('');
    alert('File uploaded to Cloud Vault folder!');
  };

  const filteredFiles = files.filter(f => f.folder === activeFolder);

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-white/10">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-400" />
            <span>Secure Cloud File Vault & BIM Asset Storage</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Version-controlled DWG, RVT 3D, PDF drawings & structural documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* FOLDERS LIST */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Vault Folders</span>
          {(['Drawings', '3D Models', 'Invoices', 'Contracts', 'General'] as const).map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`w-full px-4 py-3 rounded-2xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                activeFolder === folder ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>{folder}</span>
              </span>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full font-mono">
                {files.filter(f => f.folder === folder).length}
              </span>
            </button>
          ))}
        </div>

        {/* FILES LIST & UPLOAD FORM */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <form onSubmit={handleUploadSimulatedFile} className="flex gap-2">
            <input
              type="text"
              value={newFileName}
              onChange={e => setNewFileName(e.target.value)}
              placeholder={`Upload file to /${activeFolder} folder (e.g. Beam_Column_Rebar_v2.dwg)`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-white font-bold"
            />
            <button type="submit" className="px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-bold flex items-center gap-1 cursor-pointer">
              <Upload className="w-4 h-4" /> Upload
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm">Files inside /{activeFolder}</h3>
            {filteredFiles.map(file => (
              <div key={file.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{file.name}</div>
                    <div className="text-slate-400 text-[10px]">
                      {(file.sizeBytes / 1000000).toFixed(1)} MB • Version v{file.version} • Uploaded by {file.uploadedBy} on {file.createdAt}
                    </div>
                  </div>
                </div>

                <a
                  href={file.url}
                  download
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
