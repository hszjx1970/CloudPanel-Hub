// Fix for Vite client types not being found by replacing the reference with manual definitions.
// This resolves errors related to `import.meta.env`.
interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export enum CloudProvider {
  GoogleDrive = 'Google Drive',
  Dropbox = 'Dropbox',
  OneDrive = 'OneDrive',
  BaiduPan = 'Baidu Pan',
  AliyunDrive = 'Aliyun Drive',
  Local = 'Local',
}

export interface CloudAccount {
  id: string;
  provider: CloudProvider;
  email: string;
}

export enum FileType {
  Folder = 'folder',
  File = 'file',
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number; // in bytes
  modified: Date;
  path: string;
}

export enum TransferStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Failed = 'Failed',
  Paused = 'Paused',
}

export interface TransferJob {
  id: string;
  file: FileItem;
  source: CloudAccount;
  destination: CloudAccount;
  status: TransferStatus;
  progress: number; // 0-100
  speed?: number; // in bytes per second
  error?: string;
  controller?: AbortController;
}

export enum OrganizationActionType {
  CREATE_FOLDER = 'CREATE_FOLDER',
  MOVE_FILE = 'MOVE_FILE',
}

export interface CreateFolderAction {
  action: OrganizationActionType.CREATE_FOLDER;
  folderName: string; 
}

export interface MoveFileAction {
  action: OrganizationActionType.MOVE_FILE;
  fileName: string;
  newFolderName: string;
}

export type OrganizationAction = CreateFolderAction | MoveFileAction;
export type OrganizationPlan = OrganizationAction[];

// Electron API declaration
export interface IElectronAPI {
    getLocalIP: () => Promise<string | null>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}