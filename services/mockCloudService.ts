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
    
    // Account 2 (Dropbox)
    { id: 'f2_1', name: 'Work', type: FileType.Folder, size: 0, modified: new Date('2023-09-01'), path: '/' },
    { id: 'f2_2', name: 'receipt_september.pdf', type: FileType.File, size: 307200, modified: new Date('2023-10-05'), path: '/Work/' },

    // Account 3 (OneDrive)
    { id: 'f3_1', name: 'Personal', type: FileType.Folder, size: 0, modified: new Date('2023-10-10'), path: '/' },
    { id: 'f3_2', name: 'meeting_notes.txt', type: FileType.File, size: 2048, modified: new Date('2023-10-26'), path: '/' },
    { id: 'f3_3', name: 'design_mockup_v2.png', type: FileType.File, size: 2097152, modified: new Date('2023-10-22'), path: '/Personal/' },
    
    // Other accounts with simple structures
    { id: 'f4_1', name: 'Backup', type: FileType.Folder, size: 0, modified: new Date('2023-01-01'), path: '/' },
    { id: 'f5_1', name: 'Movies', type: FileType.Folder, size: 0, modified: new Date('2023-05-10'), path: '/' },
    { id: 'f5_2', name: 'family_trip.mp4', type: FileType.File, size: 1073741824, modified: new Date('2023-05-09'), path: '/Movies/' },
    { id: 'f6_1', name: 'Archive', type: FileType.Folder, size: 0, modified: new Date('2022-01-15'), path: '/' },
    { id: 'f6_2', name: 'old_photos_2010.zip', type: FileType.File, size: 536870912, modified: new Date('2022-01-14'), path: '/Archive/' },
    { id: 'f7_1', name: 'UC Downloads', type: FileType.Folder, size: 0, modified: new Date('2023-11-01'), path: '/' },
    { id: 'f7_2', name: 'novel.txt', type: FileType.File, size: 512000, modified: new Date('2023-11-01'), path: '/UC Downloads/' },
    { id: 'f8_1', name: 'Phone Backup', type: FileType.Folder, size: 0, modified: new Date('2023-10-30'), path: '/' },
    { id: 'f8_2', name: 'important_presentation.pptx', type: FileType.File, size: 3145728, modified: new Date('2023-10-29'), path: '/Phone Backup/' },
    { id: 'f9_1', name: 'Quark Downloads', type: FileType.Folder, size: 0, modified: new Date('2023-11-05'), path: '/' },
    { id: 'f9_2', name: 'scanned_document.pdf', type: FileType.File, size: 2048000, modified: new Date('2023-11-04'), path: '/Quark Downloads/' },
    { id: 'f10_1', name: 'QQ Files', type: FileType.Folder, size: 0, modified: new Date('2023-11-10'), path: '/' },
    { id: 'f10_2', name: 'wechat_backup.zip', type: FileType.File, size: 858993459, modified: new Date('2023-11-09'), path: '/QQ Files/' },
    { id: 'f11_1', name: 'Secure Documents', type: FileType.Folder, size: 0, modified: new Date('2023-11-12'), path: '/' },
    { id: 'f11_2', name: 'e2e_encrypted_file.dat', type: FileType.File, size: 10485760, modified: new Date('2023-11-11'), path: '/Secure Documents/' },
];

const buildMockFilesByAccount = () => {
    const mapping: Record<string, string> = {
        'acc_1': 'f1_', 'acc_2': 'f2_', 'acc_3': 'f3_',
        'acc_4': 'f4_', 'acc_5': 'f5_', 'acc_6': 'f6_',
        'acc_7': 'f7_', 'acc_8': 'f8_', 'acc_9': 'f9_',
        'acc_10': 'f10_', 'acc_11': 'f11_',
    };
    const result: Record<string, FileItem[]> = {};
    for (const accId in mapping) {
        result[accId] = allMockFiles.filter(f => f.id.startsWith(mapping[accId]));
    }
    return result;
}

let mockFilesByAccount: Record<string, FileItem[]> = buildMockFilesByAccount();


const SIMULATED_DELAY = 500;

export const getAccounts = (): Promise<CloudAccount[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([...mockAccounts]);
    }, SIMULATED_DELAY);
  });
};

export const getFiles = (accountId: string, path: string = '/'): Promise<FileItem[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const accountFiles = mockFilesByAccount[accountId];
      if (accountFiles) {
        const filesInPath = accountFiles.filter(file => file.path === path);
        resolve(filesInPath.sort((a,b) => {
          if (a.type === FileType.Folder && b.type === FileType.File) return -1;
          if (a.type === FileType.File && b.type === FileType.Folder) return 1;
          return b.modified.getTime() - a.modified.getTime();
        }));
      } else {
        // Return empty array for accounts that might not have files yet
        resolve([]);
      }
    }, SIMULATED_DELAY + Math.random() * 500);
  });
};

export const transferFile = (file: FileItem, onProgress: (progress: number, speed: number) => void, signal: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    const totalSteps = 20;
    let currentStep = 0;
    const transferTimeSeconds = (2 + Math.random() * 3); // 2-5 seconds total transfer time
    const simulatedSpeed = file.size / transferTimeSeconds; // bytes per second

    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      
      const currentSpeed = (Math.random() * 0.4 + 0.8) * simulatedSpeed; // Fluctuate speed around average
      onProgress(progress, currentSpeed);

      if (currentStep >= totalSteps) {
        cleanUp();
        // Simulate a small chance of failure
        if (Math.random() < 0.1) {
          reject(new Error('errorSimulatedFailure'));
        } else {
          resolve();
        }
      }
    }, (transferTimeSeconds * 1000) / totalSteps);

    const abortHandler = () => {
        cleanUp();
        reject(new Error('errorTransferPaused'));
    };
    
    const cleanUp = () => {
      clearInterval(interval);
      signal.removeEventListener('abort', abortHandler);
    }

    signal.addEventListener('abort', abortHandler);
  });
};

export const addAccount = (provider: CloudProvider, email: string): Promise<CloudAccount> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newAccount: CloudAccount = {
        id: `acc_${Date.now()}`,
        provider,
        email,
      };
      mockAccounts.push(newAccount);
      mockFilesByAccount[newAccount.id] = []; // Initialize with empty files
      resolve(newAccount);
    }, SIMULATED_DELAY);
  });
};

export const applyOrganizationPlan = (accountId: string, currentPath: string, plan: OrganizationPlan): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!mockFilesByAccount[accountId]) {
                mockFilesByAccount[accountId] = [];
            }
            const accountFiles = mockFilesByAccount[accountId];

            // First, create all necessary folders
            plan.forEach(action => {
                if (action.action === OrganizationActionType.CREATE_FOLDER) {
                    const newFolderPath = `${currentPath}${action.folderName}/`;
                    const folderExists = accountFiles.some(f => f.path === currentPath && f.name === action.folderName && f.type === FileType.Folder);
                    
                    if (!folderExists) {
                        const newFolder: FileItem = {
                            id: `folder_${Date.now()}_${Math.random()}`,
                            name: action.folderName,
                            type: FileType.Folder,
                            size: 0,
                            modified: new Date(),
                            path: currentPath,
                        };
                        accountFiles.push(newFolder);
                    }
                }
            });

            // Then, move all files
            plan.forEach(action => {
                if (action.action === OrganizationActionType.MOVE_FILE) {
                    const fileToMove = accountFiles.find(f => f.path === currentPath && f.name === action.fileName);
                    if (fileToMove) {
                        fileToMove.path = `${currentPath}${action.newFolderName}/`;
                    }
                }
            });
            
            resolve();
        }, SIMULATED_DELAY * 2); // Simulate a longer operation
    });
};

export const createFolder = (accountId: string, path: string, folderName: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (!mockFilesByAccount[accountId]) mockFilesByAccount[accountId] = [];
            
            const newFolder: FileItem = {
                id: `folder_${Date.now()}`,
                name: folderName,
                type: FileType.Folder,
                size: 0,
                modified: new Date(),
                path: path,
            };
            mockFilesByAccount[accountId].push(newFolder);
            resolve();
        }, SIMULATED_DELAY);
    });
};

export const renameFile = (accountId: string, path: string, fileId: string, newName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const file = mockFilesByAccount[accountId]?.find(f => f.id === fileId);
            if (file) {
                file.name = newName;
                file.modified = new Date();
                resolve();
            } else {
                reject(new Error("File not found"));
            }
        }, SIMULATED_DELAY);
    });
};

export const deleteFiles = (accountId: string, path: string, fileIds: string[]): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (mockFilesByAccount[accountId]) {
                mockFilesByAccount[accountId] = mockFilesByAccount[accountId].filter(f => !fileIds.includes(f.id));
            }
            resolve();
        }, SIMULATED_DELAY);
    });
};