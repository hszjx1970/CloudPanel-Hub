import { CloudProvider, CloudAccount, FileItem, FileType, OrganizationPlan, OrganizationActionType } from '../types';

let mockAccounts: CloudAccount[] = [
  { id: 'acc_1', provider: CloudProvider.GoogleDrive, email: 'user@gmail.com' },
  { id: 'acc_2', provider: CloudProvider.Dropbox, email: 'user@dropbox.com' },
  { id: 'acc_3', provider: CloudProvider.OneDrive, email: 'user@outlook.com' },
  { id: 'acc_4', provider: CloudProvider.BaiduPan, email: 'user@baidu.com' },
  { id: 'acc_5', provider: CloudProvider.AliyunDrive, email: 'user@aliyun.com' },
];

const allMockFiles: FileItem[] = [
    { id: 'f1_1', name: 'Documents', type: FileType.Folder, size: 0, modified: new Date('2023-10-26'), path: '/' },
    { id: 'f1_2', name: 'Photos', type: FileType.Folder, size: 0, modified: new Date('2023-10-25'), path: '/' },
    { id: 'f1_3', name: 'project_brief.docx', type: FileType.File, size: 15360, modified: new Date('2023-10-24'), path: '/' },
    { id: 'f1_4', name: 'vacation_photo_01.jpg', type: FileType.File, size: 4194304, modified: new Date('2023-08-15'), path: '/Photos/' },
    { id: 'f1_5', name: 'financials_q3.xlsx', type: FileType.File, size: 122880, modified: new Date('2023-10-20'), path: '/Documents/' },
    { id: 'f2_1', name: 'Work', type: FileType.Folder, size: 0, modified: new Date('2023-09-01'), path: '/' },
    { id: 'f2_2', name: 'receipt_september.pdf', type: FileType.File, size: 307200, modified: new Date('2023-10-05'), path: '/Work/' },
    { id: 'f3_1', name: 'Personal', type: FileType.Folder, size: 0, modified: new Date('2023-10-10'), path: '/' },
    { id: 'f3_2', name: 'meeting_notes.txt', type: FileType.File, size: 2048, modified: new Date('2023-10-26'), path: '/' },
];

const mockFilesByAccount: Record<string, FileItem[]> = {
  'acc_1': allMockFiles.filter(f => f.id.startsWith('f1_')),
  'acc_2': allMockFiles.filter(f => f.id.startsWith('f2_')),
  'acc_3': allMockFiles.filter(f => f.id.startsWith('f3_')),
  'acc_4': [],
  'acc_5': [],
};

const SIMULATED_DELAY = 300;

const simulateNetwork = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), SIMULATED_DELAY + Math.random() * 300));

export const getAccounts = (): Promise<CloudAccount[]> => simulateNetwork([...mockAccounts]);

export const getFiles = (accountId: string, path: string = '/'): Promise<FileItem[]> => {
  if (accountId === 'local') return Promise.resolve([]);
  const accountFiles = mockFilesByAccount[accountId] || [];
  const filesInPath = accountFiles.filter(file => file.path === path);
  filesInPath.sort((a,b) => {
    if (a.type !== b.type) return a.type === FileType.Folder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return simulateNetwork(filesInPath);
};

export const transferFile = (file: FileItem, onProgress: (p: number, s: number) => void, signal: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const transferTime = (2 + Math.random() * 3) * 1000;
    const interval = setInterval(() => {
      progress += 10;
      const speed = (file.size / (transferTime / 1000)) * (0.8 + Math.random() * 0.4);
      onProgress(progress, speed);
      if (progress >= 100) {
        cleanUp();
        Math.random() < 0.1 ? reject(new Error('errorSimulatedFailure')) : resolve();
      }
    }, transferTime / 10);
    const abortHandler = () => { cleanUp(); reject(new Error('errorTransferPaused')); };
    const cleanUp = () => { clearInterval(interval); signal.removeEventListener('abort', abortHandler); };
    signal.addEventListener('abort', abortHandler);
  });
};

export const addAccount = (provider: CloudProvider, email: string): Promise<CloudAccount> => {
  const newAccount: CloudAccount = { id: `acc_${Date.now()}`, provider, email };
  mockAccounts.push(newAccount);
  mockFilesByAccount[newAccount.id] = [];
  return simulateNetwork(newAccount);
};

export const applyOrganizationPlan = (accountId: string, currentPath: string, plan: OrganizationPlan): Promise<void> => {
  const accountFiles = mockFilesByAccount[accountId];
  if (!accountFiles) return Promise.reject("Account not found");
  
  plan.forEach(action => {
    if (action.action === OrganizationActionType.CREATE_FOLDER) {
      if (!accountFiles.some(f => f.path === currentPath && f.name === action.folderName)) {
        accountFiles.push({ id: `folder_${Date.now()}_${Math.random()}`, name: action.folderName, type: FileType.Folder, size: 0, modified: new Date(), path: currentPath });
      }
    }
  });
  plan.forEach(action => {
    if (action.action === OrganizationActionType.MOVE_FILE) {
      const file = accountFiles.find(f => f.path === currentPath && f.name === action.fileName);
      if (file) file.path = `${currentPath}${action.newFolderName}/`;
    }
  });
  return simulateNetwork(undefined);
};

export const createFolder = (accountId: string, path: string, folderName: string): Promise<FileItem> => {
  const newFolder: FileItem = { id: `folder_${Date.now()}`, name: folderName, type: FileType.Folder, size: 0, modified: new Date(), path };
  if (!mockFilesByAccount[accountId]) mockFilesByAccount[accountId] = [];
  mockFilesByAccount[accountId].push(newFolder);
  return simulateNetwork(newFolder);
};

export const renameFile = (accountId: string, fileId: string, newName: string): Promise<void> => {
  const file = mockFilesByAccount[accountId]?.find(f => f.id === fileId);
  if (file) {
    file.name = newName;
    file.modified = new Date();
    return simulateNetwork(undefined);
  }
  return Promise.reject("File not found");
};

export const deleteFiles = (accountId: string, fileIds: string[]): Promise<void> => {
  if (mockFilesByAccount[accountId]) {
    mockFilesByAccount[accountId] = mockFilesByAccount[accountId].filter(f => !fileIds.includes(f.id));
  }
  return simulateNetwork(undefined);
};
