import React, { useState, useContext, useRef, useEffect } from 'react';
import { CloudAccount, FileItem, FileType } from '../types';
import FileItemRow from './FileItem';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import ContextMenu from './ContextMenu';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { providerIcons } from './Sidebar';

interface FileExplorerProps {
  titleKey: 'source' | 'destination';
  account?: CloudAccount;
  files: FileItem[];
  isLoading: boolean;
  selectedFileIds?: Set<string>;
  onFileSelect?: React.Dispatch<React.SetStateAction<Set<string>>>;
  onRefresh: () => void;
  onAiRenameFile?: (fileId: string) => void;
  onManualRename?: (fileId: string, newName: string) => void;
  onDelete?: (fileIds: string[]) => void;
  onNewFolder?: () => void;
  onUpload?: (files: FileList) => void;
  onDownload?: (fileIds: string[]) => void;
  isDestination?: boolean;
  currentPath: string;
  onPathChange: (path: string) => void;
  onDropTransfer?: (fileIds: string[]) => void;
  onSmartOrganize?: () => void;
}

const Breadcrumb: React.FC<{ path: string; onPathChange: (path: string) => void }> = ({ path, onPathChange }) => {
  const { t } = useContext(LanguageContext);
  const parts = path.split('/').filter(p => p);
  
  return (
    <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex items-center">
        <li className="flex items-center">
          <button onClick={() => onPathChange('/')} className="hover:underline">{t('breadcrumbHome')}</button>
        </li>
        {parts.map((part, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2">/</span>
            {index === parts.length - 1 ? (
              <span className="font-semibold text-gray-700">{part}</span>
            ) : (
              <button onClick={() => onPathChange(`/${parts.slice(0, index + 1).join('/')}/`)} className="hover:underline">{part}</button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = (props) => {
  const { titleKey, account, files, isLoading, selectedFileIds, onFileSelect, onRefresh, onAiRenameFile, onManualRename, isDestination = false, currentPath, onPathChange, onDropTransfer, onSmartOrganize, onNewFolder, onDelete, onUpload, onDownload } = props;
  
  const { t } = useContext(LanguageContext);
  const [isDragOver, setIsDragOver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string; } | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  
  const isActionDisabled = isLoading || !account;
  const isSelectionActionsDisabled = isActionDisabled || !selectedFileIds || selectedFileIds.size === 0;
  
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onFileSelect) return;
    onFileSelect(() => {
      const newSet = new Set<string>();
      if (e.target.checked) files.forEach(file => newSet.add(file.id));
      return newSet;
    });
  };

  const allSelected = selectedFileIds && files.length > 0 && selectedFileIds.size === files.length;
  const someSelected = selectedFileIds && selectedFileIds.size > 0 && !allSelected;
  const AccountIcon = account ? providerIcons[account.provider] : ShieldIcon;

  return (
    <div className={`bg-white rounded-xl shadow-lg flex flex-col h-full overflow-hidden border border-gray-200 relative transition-all duration-300 ${isDragOver ? 'border-dashed border-2 border-brand-primary' : ''}`} onDragOver={(e) => { e.preventDefault(); if (onDropTransfer) setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (onDropTransfer && e.dataTransfer.types.includes('application/json')) { const ids = JSON.parse(e.dataTransfer.getData('application/json')); onDropTransfer(ids); } }}>
      {isDragOver && <div className="absolute inset-0 bg-blue-500 bg-opacity-20 z-20 flex items-center justify-center pointer-events-none"><p className="p-4 bg-white rounded-lg shadow-xl font-bold text-brand-primary">{t('dropFilesToTransfer')}</p></div>}
      
      <header className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 flex-wrap">
        <div className="flex items-center">
            <AccountIcon className={`w-8 h-8 mr-3 ${!account ? 'text-gray-300' : ''}`}/>
            <div>
              <h3 className="font-bold text-lg text-brand-dark">{t(titleKey)}</h3>
              {account ? <p className="text-sm text-brand-secondary">{account.email}</p> : <p className="text-sm text-gray-400">{t('noAccountSelected')}</p>}
            </div>
        </div>
        <div className="flex items-center space-x-1">
          {!isDestination && onUpload && <><input type="file" ref={uploadInputRef} onChange={e => {if (e.target.files) onUpload(e.target.files); e.target.value = '';}} multiple hidden /><button onClick={() => uploadInputRef.current?.click()} disabled={isActionDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('upload')}><UploadIcon className="w-5 h-5 text-gray-600" /></button></>}
          {!isDestination && onSmartOrganize && <button onClick={onSmartOrganize} disabled={isActionDisabled || files.filter(f => f.type === FileType.File).length === 0} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('smartOrganize')}><MagicWandIcon className="w-5 h-5 text-purple-600" /></button>}
          <button onClick={onRefresh} disabled={!account} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('refresh')}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg></button>
        </div>
      </header>
      
      <div className="p-2 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="overflow-x-auto whitespace-nowrap"><Breadcrumb path={currentPath} onPathChange={onPathChange} /></div>
        {!isDestination && (<div className="flex items-center space-x-1 pl-2">
            {onDownload && <button onClick={() => onDownload(Array.from(selectedFileIds!))} disabled={isSelectionActionsDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('download')}><DownloadIcon className="w-4 h-4 text-gray-600" /></button>}
            {onNewFolder && <button onClick={onNewFolder} disabled={isActionDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('newFolder')}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M10 12a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H8a1 1 0 110-2h1v-1a1 1 0 011-1z" /></svg></button>}
            <button onClick={() => selectedFileIds?.size === 1 && setRenamingFileId(Array.from(selectedFileIds)[0])} disabled={isActionDisabled || selectedFileIds?.size !== 1} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('rename')}><PencilIcon className="w-4 h-4 text-gray-600" /></button>
            {onDelete && <button onClick={() => onDelete(Array.from(selectedFileIds!))} disabled={isSelectionActionsDisabled} className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50" title={t('delete')}><TrashIcon className="w-4 h-4 text-gray-600" /></button>}
        </div>)}
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
            <tr>
              {!isDestination && <th scope="col" className="p-4"><input type="checkbox" className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary" onChange={handleSelectAll} checked={!!allSelected} ref={input => { if (input) input.indeterminate = !!someSelected; }} disabled={files.length === 0} /></th>}
              <th scope="col" className="px-6 py-3">{t('headerName')}</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">{t('headerModified')}</th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">{t('headerSize')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => (<tr key={i} className="bg-white border-b animate-pulse-fast">{!isDestination && <td className="p-4"><div className="h-4 w-4 bg-gray-200 rounded"/></td>}<td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"/></td><td className="px-6 py-4 hidden md:table-cell"><div className="h-4 bg-gray-200 rounded w-1/2"/></td><td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-gray-200 rounded w-1/4"/></td></tr>))
            : files.map(file => <FileItemRow key={file.id} file={file} isSelected={selectedFileIds?.has(file.id) || false} onSelect={onFileSelect} isSelectable={!isDestination} onFolderClick={(f) => onPathChange(`${f.path}${f.name}/`)} isDraggable={!isDestination} onDragStart={(e, f) => e.dataTransfer.setData('application/json', JSON.stringify(selectedFileIds?.has(f.id) ? Array.from(selectedFileIds) : [f.id]))} onContextMenu={(e, id) => { e.preventDefault(); setContextMenu({ x: e.pageX, y: e.pageY, fileId: id }); }} renamingFileId={renamingFileId} onRenameEnd={() => setRenamingFileId(null)} onManualRename={onManualRename} />)}
          </tbody>
        </table>
        {!isLoading && files.length === 0 && <div className="flex flex-col items-center justify-center text-center p-10 text-brand-secondary h-full"><ShieldIcon className="w-16 h-16 mb-4 text-gray-300" /><p className="font-semibold">{account ? t('folderIsEmpty') : t('selectAccountToViewFiles')}</p></div>}
      </div>
      {contextMenu && <ContextMenu {...contextMenu} file={files.find(f => f.id === contextMenu.fileId)} onClose={() => setContextMenu(null)} onTriggerManualRename={setRenamingFileId} onAiRename={onAiRenameFile} onDelete={onDelete} onDownload={onDownload} />}
    </div>
  );
};

export default FileExplorer;