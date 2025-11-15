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

// Define a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const ACCOUNTS_STORAGE_KEY = 'cloud-transfer-hub-accounts';

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

  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileConnectModalOpen, setIsMobileConnectModalOpen] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if the electronAPI is exposed on the window object
    if (window.electronAPI) {
      setIsElectron(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Effect for saving accounts to localStorage whenever they change
  useEffect(() => {
    // We only save if accounts is not the initial empty array to avoid overwriting.
    if (accounts.length > 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
  }, [accounts]);

  // Effect for initializing accounts from localStorage or mock service
  useEffect(() => {
    const fetchInitialData = async () => {
      const savedAccountsJSON = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      let fetchedAccounts: CloudAccount[];

      if (savedAccountsJSON && savedAccountsJSON !== '[]') {
        try {
          fetchedAccounts = JSON.parse(savedAccountsJSON);
        } catch (error) {
           console.error("Failed to parse saved accounts, falling back to default.", error);
           fetchedAccounts = await getAccounts();
        }
      } else {
        // Only fetch from mock service if nothing is saved
        fetchedAccounts = await getAccounts();
      }
      
      setAccounts(fetchedAccounts);
      if (fetchedAccounts.length > 0) {
        setSourceId(fetchedAccounts[0].id);
      }
      if (fetchedAccounts.length > 1) {
        setDestinationId(fetchedAccounts[1].id);
      }
    };
    fetchInitialData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const fetchSourceFiles = useCallback(async () => {
    if (!sourceId) return;
    setIsSourceLoading(true);
    setSelectedFileIds(new Set());
    try {
        const files = await getFiles(sourceId, sourcePath);
        setSourceFiles(files);
    } catch (error) {
        console.error("Failed to fetch source files:", error);
        setSourceFiles([]);
    } finally {
        setIsSourceLoading(false);
    }
  }, [sourceId, sourcePath]);


  const fetchDestinationFiles = useCallback(async () => {
    if (!destinationId) return;
    setIsDestinationLoading(true);
     try {
        const files = await getFiles(destinationId, destinationPath);
        setDestinationFiles(files);
    } catch (error) {
        console.error("Failed to fetch destination files:", error);
        setDestinationFiles([]);
    } finally {
        setIsDestinationLoading(false);
    }
  }, [destinationId, destinationPath]);
  
  // Reset path when source ID changes
  useEffect(() => {
    setSourcePath('/');
  }, [sourceId]);

  useEffect(() => {
    setDestinationPath('/');
  }, [destinationId]);


  useEffect(() => {
    fetchSourceFiles();
  }, [fetchSourceFiles]);

  useEffect(() => {
    fetchDestinationFiles();
  }, [fetchDestinationFiles]);
  
  const processJob = useCallback(async (job: TransferJob) => {
      if (!job.controller) return; // Should not happen
      
      setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: TransferStatus.InProgress } : t));
      
      const onProgress = (progress: number, speed: number) => {
        setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, progress, speed } : t));
      };
      
      try {
        await transferFile(job.file, onProgress, job.controller.signal);
        setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: TransferStatus.Completed, progress: 100, speed: 0 } : t));
        fetchDestinationFiles(); // Refresh destination on success
      } catch (error: any) {
        const isPaused = error.message.includes('errorTransferPaused');
        const errorMessage = isPaused ? undefined : t(error.message) || error.message;
        setTransfers(prev => prev.map(t => t.id === job.id ? { ...t, status: isPaused ? TransferStatus.Paused : TransferStatus.Failed, speed: 0, error: errorMessage } : t));
      }
  }, [fetchDestinationFiles, t]);

  const startTransfers = useCallback((filesToTransfer: FileItem[]) => {
    if (!sourceId || !destinationId || filesToTransfer.length === 0) return;

    const sourceAccount = accounts.find(a => a.id === sourceId);
    const destinationAccount = accounts.find(a => a.id === destinationId);

    if (!sourceAccount || !destinationAccount) return;

    const newTransfers: TransferJob[] = filesToTransfer.map(file => ({
      id: `${Date.now()}-${file.id}`,
      file,
      source: sourceAccount,
      destination: destinationAccount,
      status: TransferStatus.Pending,
      progress: 0,
      controller: new AbortController(),
    }));

    setTransfers(prev => [...newTransfers, ...prev]);
    setSelectedFileIds(new Set()); // Clear selection after initiating transfer

    newTransfers.forEach(job => processJob(job));
    
  }, [accounts, sourceId, destinationId, processJob]);

  const handleTransfer = () => {
    const filesToTransfer = sourceFiles.filter(f => selectedFileIds.has(f.id));
    startTransfers(filesToTransfer);
  };
  
  const handleDropTransfer = useCallback((draggedFileIds: string[]) => {
    const filesToTransfer = sourceFiles.filter(f => draggedFileIds.includes(f.id));
    startTransfers(filesToTransfer);
  }, [sourceFiles, startTransfers]);


  const handleAiRename = useCallback(async (fileId: string) => {
    const file = sourceFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      const newName = await suggestNewFileName(file.name);
      if (newName) {
        await renameFile(sourceId!, sourcePath, fileId, newName);
        fetchSourceFiles();
      }
    } catch (error) {
      console.error("AI renaming failed:", error);
    }
  }, [sourceFiles, sourceId, sourcePath, fetchSourceFiles]);
  
  const handleManualRename = useCallback(async (fileId: string, newName: string) => {
      if (!sourceId) return;
      await renameFile(sourceId, sourcePath, fileId, newName);
      fetchSourceFiles();
  }, [sourceId, sourcePath, fetchSourceFiles]);


  const handleAddNewAccount = async (provider: CloudProvider, email: string) => {
    try {
      const newAccount = await apiAddAccount(provider, email);
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    } catch (error) {
      console.error("Failed to add account:", error);
    }
  };
  
  const handleSmartOrganize = async () => {
    if (!sourceId) return;
    setIsOrganizing(true);
    try {
        const plan = await suggestOrganizationPlan(sourceFiles, sourcePath);
        if (plan && plan.length > 0) {
            setOrganizationPlan(plan);
            setIsPlanModalOpen(true);
        } else {
            console.log("No organization plan suggested.");
        }
    } catch (error) {
        console.error("Smart Organize failed:", error);
    } finally {
        setIsOrganizing(false);
    }
  };
  
  const handleApplyOrganizationPlan = async () => {
    if (!organizationPlan || !sourceId) return;
    setIsOrganizing(true);
    try {
        await applyOrganizationPlan(sourceId, sourcePath, organizationPlan);
        setIsPlanModalOpen(false);
        setOrganizationPlan(null);
        await fetchSourceFiles();
    } catch (error) {
        console.error("Failed to apply organization plan:", error);
    } finally {
        setIsOrganizing(false);
    }
  };
  
  const handleInstallClick = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    setDeferredInstallPrompt(null);
  };

  const handlePauseTransfer = (jobId: string) => {
    const job = transfers.find(t => t.id === jobId);
    if (job && job.controller) {
      job.controller.abort();
    }
  };

  const handleResumeTransfer = (jobId: string) => {
    const jobToResume = transfers.find(t => t.id === jobId);
    if (!jobToResume) return;

    const newJob: TransferJob = {
      ...jobToResume,
      id: `${Date.now()}-${jobToResume.file.id}`,
      status: TransferStatus.Pending,
      progress: 0,
      speed: 0,
      error: undefined,
      controller: new AbortController(),
    };

    setTransfers(prev => [...prev.filter(t => t.id !== jobId), newJob]);
    processJob(newJob);
  };

  const handleRemoveTransfer = (jobId: string) => {
    const job = transfers.find(t => t.id === jobId);
    if (job && job.status === TransferStatus.InProgress) {
        job.controller?.abort();
    }
    setTransfers(prev => prev.filter(t => t.id !== jobId));
  };

  const handleCreateFolder = async (folderName: string) => {
    if (!sourceId || !folderName.trim()) return;
    await createFolder(sourceId, sourcePath, folderName);
    fetchSourceFiles();
    setIsNewFolderModalOpen(false);
  };

  const handleDeleteFiles = async (fileIds: string[]) => {
      if (!sourceId || fileIds.length === 0) return;
      if (window.confirm(t('confirmDelete'))) {
          await deleteFiles(sourceId, sourcePath, fileIds);
          fetchSourceFiles();
      }
  };


  return (
    <div className="flex h-screen bg-gray-100 font-sans text-brand-dark">
      <Sidebar 
        accounts={accounts} 
        sourceId={sourceId}
        destinationId={destinationId}
        onSetSource={(id) => { setSourceId(id); setIsSidebarOpen(false); }}
        onSetDestination={(id) => { setDestinationId(id); setIsSidebarOpen(false); }}
        onAddNewAccount={handleAddNewAccount}
        onInstall={handleInstallClick}
        canInstall={!!deferredInstallPrompt && !isElectron}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenMobileConnect={() => setIsMobileConnectModalOpen(true)}
      />
      <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <button className="p-2 mr-2 rounded-full hover:bg-gray-200 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-brand-dark">{t('appTitle')}</h1>
              <p className="text-brand-secondary hidden sm:block">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="px-4 py-2 text-sm font-semibold bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition"
            >
              {language === 'en' ? '中文' : 'English'}
            </button>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 overflow-hidden">
           <FileExplorer
            title={t('source')}
            account={accounts.find(a => a.id === sourceId)}
            files={sourceFiles}
            isLoading={isSourceLoading || isOrganizing}
            selectedFileIds={selectedFileIds}
            onFileSelect={setSelectedFileIds}
            onRefresh={fetchSourceFiles}
            onAiRenameFile={handleAiRename}
            onManualRename={handleManualRename}
            onDelete={handleDeleteFiles}
            currentPath={sourcePath}
            onPathChange={setSourcePath}
            onSmartOrganize={handleSmartOrganize}
            onNewFolder={() => setIsNewFolderModalOpen(true)}
          />

          <div className="flex items-center justify-center my-4 lg:my-0">
            <button 
              onClick={handleTransfer}
              disabled={selectedFileIds.size === 0 || !sourceId || !destinationId || sourceId === destinationId}
              className="bg-brand-primary text-white rounded-full p-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
              title={t('transferFiles')}
            >
              <TransferIcon className="w-8 h-8 lg:w-8 lg:h-8" />
            </button>
          </div>

          <FileExplorer
            title={t('destination')}
            account={accounts.find(a => a.id === destinationId)}
            files={destinationFiles}
            isLoading={isDestinationLoading}
            onRefresh={fetchDestinationFiles}
            isDestination
            currentPath={destinationPath}
            onPathChange={setDestinationPath}
            onDropTransfer={handleDropTransfer}
          />
        </div>

        <TransferQueue 
          jobs={transfers} 
          onPause={handlePauseTransfer}
          onResume={handleResumeTransfer}
          onRetry={handleResumeTransfer} // Retry logic is same as resume
          onRemove={handleRemoveTransfer}
        />
      </main>
      
      <OrganizationPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onApply={handleApplyOrganizationPlan}
        plan={organizationPlan}
        isLoading={isOrganizing}
      />
      
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <MobileConnectModal
        isOpen={isMobileConnectModalOpen}
        onClose={() => setIsMobileConnectModalOpen(false)}
        isElectron={isElectron}
      />

    </div>
  );
};

export default App;