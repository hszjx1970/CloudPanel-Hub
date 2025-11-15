import React, { useState, useContext } from 'react';
import { TransferJob, TransferStatus, CloudProvider } from '../types';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { DropboxIcon } from './icons/DropboxIcon';
import { OneDriveIcon } from './icons/OneDriveIcon';
import { BaiduPanIcon } from './icons/BaiduPanIcon';
import { CloudIcon } from './icons/CloudIcon';
import { TransferIcon } from './icons/TransferIcon';
import { AliyunDriveIcon } from './icons/AliyunDriveIcon';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { RetryIcon } from './icons/RetryIcon';
import { CloseIcon } from './icons/CloseIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import { ComputerIcon } from './icons/ComputerIcon';

interface TransferQueueProps {
  jobs: TransferJob[];
  onPause: (jobId: string) => void;
  onResume: (jobId: string) => void;
  onRetry: (jobId: string) => void;
  onRemove: (jobId: string) => void;
}

const providerIcons: Record<string, React.FC<{ className: string }>> = {
  [CloudProvider.GoogleDrive]: GoogleDriveIcon,
  [CloudProvider.Dropbox]: DropboxIcon,
  [CloudProvider.OneDrive]: OneDriveIcon,
  [CloudProvider.BaiduPan]: BaiduPanIcon,
  [CloudProvider.AliyunDrive]: AliyunDriveIcon,
  [CloudProvider.Local]: ComputerIcon,
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const StatusIndicator: React.FC<{ status: TransferStatus }> = ({ status }) => {
  const { t } = useContext(LanguageContext);
  const statusMap = {
    [TransferStatus.Completed]: { color: 'bg-green-500', title: t('statusCompleted') },
    [TransferStatus.InProgress]: { color: 'bg-blue-500 animate-pulse', title: t('statusInProgress') },
    [TransferStatus.Failed]: { color: 'bg-red-500', title: t('statusFailed') },
    [TransferStatus.Paused]: { color: 'bg-yellow-500', title: t('statusPaused') },
    [TransferStatus.Pending]: { color: 'bg-gray-400', title: t('statusPending') },
  };
  const { color, title } = statusMap[status] || statusMap[TransferStatus.Pending];
  return <div className={`w-3 h-3 rounded-full ${color}`} title={title} />;
};

const JobItem: React.FC<Omit<TransferQueueProps, 'jobs'> & { job: TransferJob }> = ({ job, onPause, onResume, onRetry, onRemove }) => {
  const { t } = useContext(LanguageContext);
  const SourceIcon = providerIcons[job.source.provider] || CloudIcon;
  const DestIcon = providerIcons[job.destination.provider] || CloudIcon;

  return (
    <li className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          <StatusIndicator status={job.status} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-dark truncate" title={job.file.name}>{job.file.name}</p>
            <p className="text-xs text-brand-secondary">
              {job.status === TransferStatus.InProgress && job.speed ? (<><span className="font-medium text-blue-600">{formatBytes(job.speed)}/s</span><span className="mx-1">·</span></>) : null}
              <span>{formatBytes(job.file.size)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-brand-secondary flex-shrink-0 ml-2">
          <SourceIcon className="w-4 h-4" /><span>→</span><DestIcon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-300 ${job.status === TransferStatus.Failed ? 'bg-red-500' : job.status === TransferStatus.Paused ? 'bg-yellow-500' : 'bg-brand-primary'}`} style={{ width: `${job.progress}%` }} /></div>
        <div className="flex items-center space-x-1">
          {job.status === TransferStatus.InProgress && <button onClick={() => onPause(job.id)} title={t('pause')} className="p-1 hover:bg-gray-200 rounded-full"><PauseIcon className="w-4 h-4 text-gray-600" /></button>}
          {job.status === TransferStatus.Paused && <button onClick={() => onResume(job.id)} title={t('resume')} className="p-1 hover:bg-gray-200 rounded-full"><PlayIcon className="w-4 h-4 text-gray-600" /></button>}
          {job.status === TransferStatus.Failed && <button onClick={() => onRetry(job.id)} title={t('retry')} className="p-1 hover:bg-gray-200 rounded-full"><RetryIcon className="w-4 h-4 text-gray-600" /></button>}
          <button onClick={() => onRemove(job.id)} title={t('remove')} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon className="w-4 h-4 text-gray-600" /></button>
        </div>
      </div>
      {job.status === TransferStatus.Failed && job.error && <p className="text-xs text-red-600 mt-1">{t('errorPrefix')} {job.error}</p>}
    </li>
  );
};

const TransferQueue: React.FC<TransferQueueProps> = (props) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useContext(LanguageContext);

  if (props.jobs.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 w-[calc(100%-2rem)] sm:w-full max-w-sm z-50">
      <div className="bg-gray-50 rounded-xl shadow-2xl border border-gray-300 overflow-hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-white border-b">
          <div className="flex items-center space-x-3">
            <TransferIcon className="w-6 h-6 text-brand-primary" />
            <h4 className="font-bold text-lg text-brand-dark">{t('transferQueue')}</h4>
            <span className="bg-brand-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{props.jobs.length}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        {isOpen && <div className="p-3"><ul className="space-y-2 max-h-64 overflow-y-auto">{props.jobs.map(job => <JobItem key={job.id} job={job} {...props} />)}</ul></div>}
      </div>
    </div>
  );
};

export default TransferQueue;
