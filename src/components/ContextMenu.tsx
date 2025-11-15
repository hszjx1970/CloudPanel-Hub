import React, { useContext } from 'react';
import { FileItem, FileType } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LanguageContext } from '../contexts/LanguageContext';
import { DownloadIcon } from './icons/DownloadIcon';

interface ContextMenuProps {
  x: number;
  y: number;
  file?: FileItem;
  onClose: () => void;
  onDelete?: (fileIds: string[]) => void;
  onDownload?: (fileIds: string[]) => void;
  onTriggerManualRename?: (fileId:string) => void;
  onAiRename?: (fileId: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, file, onClose, onDownload, onTriggerManualRename, onAiRename, onDelete }) => {
    const { t } = useContext(LanguageContext);

    if (!file) return null;

    const handleAction = (action?: (...args: any[]) => void, ...args: any[]) => {
      if (action) action(...args);
      onClose();
    };

    return (
        <div style={{ top: y, left: x }} className="absolute z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <ul className="py-1 text-sm text-gray-700">
                {onTriggerManualRename && <li><button onClick={() => handleAction(onTriggerManualRename, file.id)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100"><PencilIcon className="w-4 h-4 mr-3" />{t('rename')}</button></li>}
                {onAiRename && file.type === FileType.File && <li><button onClick={() => handleAction(onAiRename, file.id)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100"><MagicWandIcon className="w-4 h-4 mr-3 text-purple-600" />{t('aiRename')}</button></li>}
                {onDownload && file.type === FileType.File && <li><button onClick={() => handleAction(onDownload, [file.id])} className="flex items-center w-full px-4 py-2 hover:bg-gray-100"><DownloadIcon className="w-4 h-4 mr-3" />{t('download')}</button></li>}
                {onDelete && <div className="border-t my-1"></div>}
                {onDelete && <li><button onClick={() => handleAction(onDelete, [file.id])} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"><TrashIcon className="w-4 h-4 mr-3" />{t('delete')}</button></li>}
            </ul>
        </div>
    );
};

export default ContextMenu;