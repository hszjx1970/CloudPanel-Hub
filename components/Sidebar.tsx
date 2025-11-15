import React, { useState, useContext } from 'react';
import { CloudAccount, CloudProvider } from '../types';
import { GoogleDriveIcon } from './icons/GoogleDriveIcon';
import { DropboxIcon } from './icons/DropboxIcon';
import { OneDriveIcon } from './icons/OneDriveIcon';
import { BaiduPanIcon } from './icons/BaiduPanIcon';
import { CloudIcon } from './icons/CloudIcon';
import { UCDriveIcon } from './icons/UCDriveIcon';
import { HuaweiCloudIcon } from './icons/HuaweiCloudIcon';
import { AliyunDriveIcon } from './icons/AliyunDriveIcon';
import { Pan115Icon } from './icons/Pan115Icon';
import { QuarkDriveIcon } from './icons/QuarkDriveIcon';
import { TencentWeiyunIcon } from './icons/TencentWeiyunIcon';
import { MegaIcon } from './icons/MegaIcon';
import AddAccountModal from './AddAccountModal';
import { DownloadIcon } from './icons/DownloadIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import { QRIcon } from './icons/QRIcon';

interface SidebarProps {
  accounts: CloudAccount[];
  sourceId: string | null;
  destinationId: string | null;
  onSetSource: (id: string) => void;
  onSetDestination: (id: string) => void;
  onAddNewAccount: (provider: CloudProvider, email: string) => Promise<void>;
  onInstall: () => void;
  canInstall: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenMobileConnect: () => void;
}

const providerIcons: Record<string, React.FC<{ className: string }>> = {
  'Google Drive': GoogleDriveIcon,
  'Dropbox': DropboxIcon,
  'OneDrive': OneDriveIcon,
  'Baidu Pan': BaiduPanIcon,
  'UC Drive': UCDriveIcon,
  'Huawei Cloud': HuaweiCloudIcon,
  'Aliyun Drive': AliyunDriveIcon,
  '115 Pan': Pan115Icon,
  'Quark Drive': QuarkDriveIcon,
  'Tencent Weiyun': TencentWeiyunIcon,
  'MEGA': MegaIcon,
};

const AccountItem: React.FC<{ account: CloudAccount; children: React.ReactNode }> = ({ account, children }) => {
  const { t } = useContext(LanguageContext);
  const Icon = providerIcons[account.provider] || CloudIcon;
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 bg-white shadow-sm border border-gray-200">
      <Icon className="w-8 h-8 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate text-brand-dark">{t(`provider_${account.provider}`)}</p>
        <p className="text-xs text-brand-secondary truncate">{account.email}</p>
      </div>
      <div className="flex space-x-2">{children}</div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ accounts, sourceId, destinationId, onSetSource, onSetDestination, onAddNewAccount, onInstall, canInstall, isOpen, onClose, onOpenMobileConnect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useContext(LanguageContext);
  
  const handleAddAccount = async (provider: CloudProvider, email: string) => {
    await onAddNewAccount(provider, email);
    setIsModalOpen(false);
  };

  return (
    <>
       {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={onClose}></div>}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-64 md:w-80 bg-white h-full p-4 flex flex-col border-r border-gray-200 shadow-lg lg:shadow-md transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-brand-primary rounded-lg">
              <CloudIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="ml-3 text-xl font-bold text-brand-dark">{t('accounts')}</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {accounts.map(account => (
            <AccountItem key={account.id} account={account}>
              <button
                onClick={() => onSetSource(account.id)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  sourceId === account.id
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {t('source')}
              </button>
              <button
                onClick={() => onSetDestination(account.id)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  destinationId === account.id
                    ? 'bg-green-500 text-white shadow'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } ${sourceId === account.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={sourceId === account.id}
              >
                {t('dest')}
              </button>
            </AccountItem>
          ))}
          {accounts.length === 0 && (
            <div className="text-center text-brand-secondary p-4">
              <p>{t('noAccountsConnected')}</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-2 text-sm text-brand-primary hover:underline">{t('connectAnAccount')}</button>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-brand-primary text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                {t('addNewAccount')}
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={onOpenMobileConnect}
                className="w-full flex items-center justify-center space-x-2 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                title={t('connectMobileDevice')}
              >
                  <QRIcon className="w-5 h-5" />
              </button>
              {canInstall && (
                <button 
                  onClick={onInstall}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                    <DownloadIcon className="w-5 h-5" />
                    <span>{t('installApp')}</span>
                </button>
              )}
            </div>
        </div>
      </aside>
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </>
  );
};

export default Sidebar;