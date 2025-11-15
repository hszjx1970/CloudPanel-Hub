import React, { useState, useEffect, useCallback, useContext } from 'react';
import { CloudAccount, FileItem, TransferJob, TransferStatus, CloudProvider, OrganizationPlan, FileType } from './types';
import { getAccounts, getFiles, transferFile, addAccount as apiAddAccount, applyOrganizationPlan, createFolder, renameFile, deleteFiles } from './services/mockCloudService';
import { suggestNewFileName, suggestOrganizationPlan } from './services/geminiService';
import Sidebar from './components/Sidebar';
import FileExplorer from './components/FileExplorer';
import TransferQueue from './components/TransferQueue';
import { TransferIcon } from './components/icons/TransferIcon';
import OrganizationPlanModal from './components/OrganizationPlanModal';
import { LanguageContext } from './contexts/LanguageContext';
import NewFolderModal from './components/NewFolderModal';
import { MenuIcon } from './components/icons/MenuIcon';
import MobileConnectModal from './components/MobileConnectModal';

const ACCOUNTS_STORAGE_KEY = 'cloud-transfer-hub-accounts';

export const LOCAL_COMPUTER_ACCOUNT: CloudAccount = {
  id: 'local',
  provider: CloudProvider.Local,
  email: 'user@local.computer',
};

const App: React.FC = () => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  const [accounts, setAccounts] = useState<CloudAccount[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [destinationId, setDestinationId] = useState<string | null>(null);

  const [sourcePath, setSourcePath] = useState('/');
  const [destinationPath, setDestinationPath] = useState('/');

  const [sourceFiles, setSourceFiles] = useState<FileItem[]>([]);
  const [destinationFiles, setDestinationFiles] = useState<FileItem[]>([]);
  const [isSourceLoading, setIsSourceLoading] = useState(false);
  const [isDestinationLoading, setIsDestinationLoading] = useState(false);

  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [transfers, setTransfers] = useState<TransferJob[]>([]);
  
  const [organizationPlan, setOrganizationPlan] = useState<OrganizationPlan | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileConnectModalOpen, setIsMobileConnectModalOpen] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      setIsElectron(true);
    }
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
  }, [accounts]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const savedAccountsJSON = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      let fetchedAccounts: CloudAccount[];

      try {
        fetchedAccounts = savedAccountsJSON ? JSON.parse(savedAccountsJSON) : await getAccounts();
      } catch {
        fetchedAccounts = await getAccounts();
      }
      
      setAccounts(fetchedAccounts);
      if (fetchedAccounts.length > 0) setSourceId(fetchedAccounts[0].id);
      if (fetchedAccounts.length > 1) setDestinationId(fetchedAccounts[1].id);
    };
    fetchInitialData();
  }, []);

  const fetchFiles = useCallback(async (
    accountId: string | null, 
    path: string, 
    setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>, 
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!accountId) {
      setFiles([]);
      return;
    }
    setIsLoading(true);
    try {
      const files = await getFiles(accountId, path);
      setFiles(files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setSourcePath('/');
    setSelectedFileIds(new Set());
  }, [sourceId]);

  useEffect(() => {
    setDestinationPath('/');
  }, [destinationId]);

  const fetchSourceFiles = useCallback(() => fetchFiles(sourceId, sourcePath, setSourceFiles, setIsSourceLoading), [sourceId, sourcePath, fetchFiles]);
  const fetchDestinationFiles = useCallback(() => fetchFiles(destinationId, destinationPath, setDestinationFiles, setIsDestinationLoading), [destinationId, destinationPath, fetchFiles]);

  useEffect(() => {
    fetchSourceFiles();
  }, [fetchSourceFiles]);

  useEffect(() => {
    fetchDestinationFiles();
  }, [fetchDestinationFiles]);
  
  const processJob = useCallback(async (job: TransferJob) => {
    setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: TransferStatus.InProgress } : t));
    
    try {
      await transferFile(job.file, (p, s) => {
        setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, progress: p, speed: s } : t));
      }, job.controller!.signal);
      setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: TransferStatus.Completed, progress: 100, speed: 0 } : t));
      if (job.destination.id === destinationId) fetchDestinationFiles();
    } catch (error: any) {
      const isPaused = error.message.includes('errorTransferPaused');
      const errorMessage = isPaused ? undefined : t(error.message) || error.message;
      setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: isPaused ? TransferStatus.Paused : TransferStatus.Failed, speed: 0, error: errorMessage } : t));
    }
  }, [destinationId, fetchDestinationFiles, t]);

  const startTransfers = useCallback((filesToTransfer: FileItem[], sourceAccount: CloudAccount, destinationAccount: CloudAccount) => {
    if (filesToTransfer.length === 0) return;
    const newTransfers: TransferJob[] = filesToTransfer.map(file => ({
      id: `${Date.now()}-${file.id}`,
      file, source: sourceAccount, destination: destinationAccount,
      status: TransferStatus.Pending, progress: 0, controller: new AbortController(),
    }));
    setTransfers(prev => [...newTransfers, ...prev]);
    setSelectedFileIds(new Set());
    newTransfers.forEach(processJob);
  }, [processJob]);

  const handleTransfer = () => {
    const sourceAccount = accounts.find(a => a.id === sourceId);
    const destinationAccount = accounts.find(a => a.id === destinationId);
    if (!sourceAccount || !destinationAccount) return;
    const filesToTransfer = sourceFiles.filter(f => selectedFileIds.has(f.id));
    startTransfers(filesToTransfer, sourceAccount, destinationAccount);
  };
  
  const handleDropTransfer = useCallback((draggedFileIds: string[]) => {
    const sourceAccount = accounts.find(a => a.id === sourceId);
    const destinationAccount = accounts.find(a => a.id === destinationId);
    if (!sourceAccount || !destinationAccount) return;
    const filesToTransfer = sourceFiles.filter(f => draggedFileIds.includes(f.id));
    startTransfers(filesToTransfer, sourceAccount, destinationAccount);
  }, [sourceFiles, sourceId, destinationId, accounts, startTransfers]);

  const handleAiRename = useCallback(async (fileId: string) => {
    const file = sourceFiles.find(f => f.id === fileId);
    if (!file || !sourceId) return;
    try {
      const newName = await suggestNewFileName(file.name);
      if (newName) {
        await renameFile(sourceId, fileId, newName);
        fetchSourceFiles();
      }
    } catch (error) { console.error("AI renaming failed:", error); }
  }, [sourceFiles, sourceId, fetchSourceFiles]);
  
  const handleManualRename = useCallback(async (fileId: string, newName: string) => {
    if (!sourceId) return;
    await renameFile(sourceId, fileId, newName);
    fetchSourceFiles();
  }, [sourceId, fetchSourceFiles]);

  const handleAddNewAccount = async (provider: CloudProvider, email: string) => {
    const newAccount = await apiAddAccount(provider, email);
    setAccounts(prev => [...prev, newAccount]);
  };
  
  const handleSmartOrganize = async () => {
    if (!sourceId) return;
    setIsOrganizing(true);
    try {
      const plan = await suggestOrganizationPlan(sourceFiles.filter(f => f.type === FileType.File), sourcePath);
      setOrganizationPlan(plan);
      setIsPlanModalOpen(true);
    } catch (error) { console.error("Smart Organize failed:", error); }
    finally { setIsOrganizing(false); }
  };
  
  const handleApplyOrganizationPlan = async () => {
    if (!organizationPlan || !sourceId) return;
    setIsOrganizing(true);
    try {
      await applyOrganizationPlan(sourceId, sourcePath, organizationPlan);
      fetchSourceFiles();
    } catch (error) { console.error("Failed to apply plan:", error); }
    finally { setIsPlanModalOpen(false); setOrganizationPlan(null); setIsOrganizing(false); }
  };

  const handlePauseTransfer = (jobId: string) => transfers.find(t => t.id === jobId)?.controller?.abort();
  const handleResumeTransfer = (jobId: string) => {
    const job = transfers.find(t => t.id === jobId);
    if (!job) return;
    const newJob: TransferJob = { ...job, id: `${Date.now()}-${job.file.id}`, status: TransferStatus.Pending, progress: 0, speed: 0, error: undefined, controller: new AbortController() };
    setTransfers(prev => [newJob, ...prev.filter(t => t.id !== jobId)]);
    processJob(newJob);
  };
  const handleRemoveTransfer = (jobId: string) => {
    transfers.find(t => t.id === jobId && t.status === TransferStatus.InProgress)?.controller?.abort();
    setTransfers(prev => prev.filter(t => t.id !== jobId));
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!sourceId || !folderName.trim()) return;
    await createFolder(sourceId, sourcePath, folderName);
    fetchSourceFiles();
    setIsNewFolderModalOpen(false);
  };

  const handleDeleteFiles = async (fileIds: string[]) => {
    if (!sourceId || fileIds.length === 0 || !window.confirm(t('confirmDelete'))) return;
    await deleteFiles(sourceId, fileIds);
    fetchSourceFiles();
  };

  const handleUploadFiles = (files: FileList) => {
    const destinationAccount = accounts.find(a => a.id === sourceId);
    if (!destinationAccount) return;
    const filesToTransfer = Array.from(files).map((file): FileItem => ({
      id: `local-${file.name}-${file.lastModified}`, name: file.name, type: FileType.File,
      size: file.size, modified: new Date(file.lastModified), path: '/',
    }));
    startTransfers(filesToTransfer, LOCAL_COMPUTER_ACCOUNT, destinationAccount);
  };

  const handleDownloadFiles = (fileIds: string[]) => {
    sourceFiles.filter(f => fileIds.includes(f.id)).forEach(file => {
      const blob = new Blob([`Mock download for: ${file.name}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = file.name;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-brand-dark">
      <Sidebar accounts={accounts} sourceId={sourceId} destinationId={destinationId} onSetSource={id => { setSourceId(id); setIsSidebarOpen(false); }} onSetDestination={id => { setDestinationId(id); setIsSidebarOpen(false); }} onAddNewAccount={handleAddNewAccount} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onOpenMobileConnect={() => setIsMobileConnectModalOpen(true)} />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button className="p-2 mr-2 rounded-full hover:bg-gray-200 lg:hidden" onClick={() => setIsSidebarOpen(true)}><MenuIcon className="w-6 h-6" /></button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-dark">{t('appTitle')}</h1>
              <p className="text-brand-secondary hidden sm:block">{t('appSubtitle')}</p>
            </div>
          </div>
          <button onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')} className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition">{language === 'en' ? '中文' : 'English'}</button>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 overflow-hidden">
          <FileExplorer titleKey="source" account={accounts.find(a => a.id === sourceId)} files={sourceFiles} isLoading={isSourceLoading || isOrganizing} selectedFileIds={selectedFileIds} onFileSelect={setSelectedFileIds} onRefresh={fetchSourceFiles} onAiRenameFile={handleAiRename} onManualRename={handleManualRename} onDelete={handleDeleteFiles} onUpload={handleUploadFiles} onDownload={handleDownloadFiles} currentPath={sourcePath} onPathChange={setSourcePath} onSmartOrganize={handleSmartOrganize} onNewFolder={() => setIsNewFolderModalOpen(true)} />
          <div className="flex items-center justify-center my-4 lg:my-0">
            <button onClick={handleTransfer} disabled={selectedFileIds.size === 0 || !sourceId || !destinationId || sourceId === destinationId} className="bg-brand-primary text-white rounded-full p-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none" title={t('transferFiles')}><TransferIcon className="w-8 h-8" /></button>
          </div>
          <FileExplorer titleKey="destination" account={accounts.find(a => a.id === destinationId)} files={destinationFiles} isLoading={isDestinationLoading} onRefresh={fetchDestinationFiles} isDestination currentPath={destinationPath} onPathChange={setDestinationPath} onDropTransfer={handleDropTransfer} />
        </div>

        <TransferQueue jobs={transfers} onPause={handlePauseTransfer} onResume={handleResumeTransfer} onRetry={handleResumeTransfer} onRemove={handleRemoveTransfer} />
      </main>
      
      <OrganizationPlanModal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} onApply={handleApplyOrganizationPlan} plan={organizationPlan} isLoading={isOrganizing} />
      <NewFolderModal isOpen={isNewFolderModalOpen} onClose={() => setIsNewFolderModalOpen(false)} onCreate={handleCreateFolder} />
      <MobileConnectModal isOpen={isMobileConnectModalOpen} onClose={() => setIsMobileConnectModalOpen(false)} isElectron={isElectron} />
    </div>
  );
};

export default App;