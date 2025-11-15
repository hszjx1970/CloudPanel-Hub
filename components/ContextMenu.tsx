import React, { useContext } from 'react';
import { FileItem } from '../types';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface ContextMenuProps {
  x: number;
  y: number;
  file?: FileItem;
  onClose: () => void;
  onDelete?: (fileIds: string[]) => void;
  onManualRename?: (fileId: string, newName: string) => void;
  onAiRename?: (fileId: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, file, onClose, onDelete, onManualRename, onAiRename }) => {
    const { t } = useContext(LanguageContext);

    if (!file) return null;

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };
    
    const handleDelete = () => {
        if(onDelete) onDelete([file.id]);
    }

    // A real implementation of manual rename would likely trigger an inline input in FileItemRow
    // This is a placeholder for that logic.
    const handleRename = () => {
       // This would typically be handled in the FileItemRow component by setting a state
       console.log("Rename action triggered for", file.id);
    }
    
    const handleAiRename = () => {
        if(onAiRename) onAiRename(file.id);
    }

    return (
        <div
            style={{ top: y, left: x }}
            className="absolute z-50 w-48 bg-white rounded-md shadow-lg border border-gray-200"
            onClick={(e) => e.stopPropagation()}
        >
            <ul className="py-1 text-sm text-gray-700">
                {onManualRename && (
                     <li>
                        <button onClick={() => handleAction(handleRename)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                            <PencilIcon className="w-4 h-4 mr-3" />
                            {t('rename')}
                        </button>
                    </li>
                )}
                {onAiRename && file.type === 'file' && (
                     <li>
                        <button onClick={() => handleAction(handleAiRename)} className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                            <MagicWandIcon className="w-4 h-4 mr-3 text-purple-600" />
                            AI {t('rename')}
                        </button>
                    </li>
                )}
                {onDelete && (
                     <li>
                        <button onClick={() => handleAction(handleDelete)} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50">
                            <TrashIcon className="w-4 h-4 mr-3" />
                            {t('delete')}
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default ContextMenu;
