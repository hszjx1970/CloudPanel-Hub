import { CloudProvider, CloudAccount, FileItem, FileType, OrganizationPlan, OrganizationActionType } from '../types';

let mockAccounts: CloudAccount[] = [
  { id: 'acc_1', provider: CloudProvider.GoogleDrive, email: 'user@gmail.com' },
  { id: 'acc_2', provider: CloudProvider.Dropbox, email: 'user@dropbox.com' },
  { id: 'acc_3', provider: CloudProvider.OneDrive, email: 'user@outlook.com' },
  { id: 'acc_4', provider: CloudProvider.BaiduPan, email: 'user@baidu.com' },
  { id: 'acc_5', provider: CloudProvider.AliyunDrive, email: 'user@aliyun.com' },
  { id: 'acc_6', provider: CloudProvider.Pan115, email: 'user@115.com' },
  { id: 'acc_7', provider: CloudProvider.UCDrive, email: 'user@uc.cn' },
  { id: 'acc_8', provider: CloudProvider.HuaweiCloud, email: 'user@huawei.com' },
  { id: 'acc_9', provider: CloudProvider.QuarkDrive, email: 'user@quark.com' },
  { id: 'acc_10', provider: CloudProvider.TencentWeiyun, email: 'user@qq.com' },
  { id: 'acc_11', provider: CloudProvider.Mega, email: 'user@mega.nz' },
];

let allMockFiles: FileItem[] = [
    // Account 1 (Google Drive)
    { id: 'f1_1', name: 'Documents', type: FileType.Folder, size: 0, modified: new Date('2023-10-26'), path: '/' },
    { id: 'f1_2', name: 'Photos', type: FileType.Folder, size: 0, modified: new Date('2023-10-25'), path: '/' },
    { id: 'f1_3', name: 'project_brief.docx', type: FileType.File, size: 15360, modified: new Date('2023-10-24'), path: '/' },
    { id: 'f1_4', name: 'vacation_photo_01.jpg', type: FileType.File, size: 4194304, modified: new Date('2023-08-15'), path: '/Photos/' },
    { id: 'f1_5', name: 'financials_q3.xlsx', type: FileType.File, size: 122880, modified: new Date('2023-10-20'), path: '/Documents/' },
    { id: 'f1_6', name: 'Reports', type: FileType.Folder, size: 0, modified: new Date('2023-09-11'), path: '/Documents/' },
    { id: 'f1_7', name: 'annual_report.pdf', type: FileType.File, size: 2400000, modified: new Date('2023-09-10'), path: '/Documents/Reports/' },
    { id: 'f1_8', name: 'family_video_2023.mp4', type: FileType.File, size: 34298492, modified: new Date('2023-11-15'), path: '/' },
    { id: 'f1_9', name: 'screenshot-1.png', type: FileType.File, size: 823491, modified: new Date('2023-11-10'), path: '/' },
    
    // Other accounts with simple structures
    { id: 'f2_1', name: 'Work', type: FileType.Folder, size: 0, modified: new Date('2023-09-01'), path: '/' },
    { id: 'f3_1', name: 'Personal', type: FileType.Folder, size: 0, modified: new Date('2023-10-10'), path: '/' },
    { id: 'f4_1', name: 'Backup', type: FileType.Folder, size: 0, modified: new Date('2023-01-01'), path: '/' },
    { id: 'f5_1', name: 'Movies', type: FileType.Folder, size: 0, modified: new Date('2023-05-10'), path: '/' },
    { id: 'f5_2', name: 'family_trip.mp4', type: FileType.File, size: 1073741824, modified: new Date('2023-05-09'), path: '/Movies/' },
    { id: 'f6_1', name: 'Archive', type: FileType.Folder, size: 0, modified: new Date('2022-01-15'), path: '/' },
    { id: 'f7_1', name: 'UC Downloads', type: FileType.Folder, size: 0, modified: new Date('2023-11-01'), path: '/' },
    { id: 'f8_1', name: 'Phone Backup', type: FileType.Folder, size: 0, modified: new Date('2023-10-30'), path: '/' },
    { id: 'f9_1', name: 'Quark Downloads', type: FileType.Folder, size: 0, modified: new Date('2023-11-05'), path: '/' },
    { id: 'f10_1', name: 'QQ Files', type: FileType.Folder, size: 0, modified: new Date('2023-11-10'), path: '/' },
    { id: 'f11_1', name: 'Secure Documents', type: FileType.Folder, size: 0, modified: new Date('2023-11-12'), path: '/' },
];

const mockFilesByAccount: Record<string, FileItem[]> = allMockFiles.reduce((acc, file) => {
    const accIndex = parseInt(file.id.split('_')[0].substring(1), 10);
    const accId = `acc_${accIndex}`;
    if (!acc[accId]) {
        acc[accId] = [];
    }
    acc[accId].push(file);
    return acc;
}, {} as Record<string, FileItem[]>);


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