

export enum CloudProvider {
  GoogleDrive = 'Google Drive',
  Dropbox = 'Dropbox',
  OneDrive = 'OneDrive',
  BaiduPan = 'Baidu Pan',
  UCDrive = 'UC Drive',
  HuaweiCloud = 'Huawei Cloud',
  AliyunDrive = 'Aliyun Drive',
  Pan115 = '115 Pan',
  QuarkDrive = 'Quark Drive',
  TencentWeiyun = 'Tencent Weiyun',
  Mega = 'MEGA',
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
  // Non-serializable, for in-memory state management
  controller?: AbortController;
}


// Types for AI Organization Plan
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