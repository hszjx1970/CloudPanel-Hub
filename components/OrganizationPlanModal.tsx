import React, { useContext } from 'react';
import { OrganizationPlan, OrganizationActionType, OrganizationAction, MoveFileAction, CreateFolderAction } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { TransferIcon } from './icons/TransferIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface OrganizationPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  plan: OrganizationPlan | null;
  isLoading: boolean;
}

const ActionItem: React.FC<{ action: OrganizationAction }> = ({ action }) => {
    const { t } = useContext(LanguageContext);
    if (action.action === OrganizationActionType.CREATE_FOLDER) {
        const createAction = action as CreateFolderAction;
        return (
            <div className="flex items-center space-x-3 text-sm">
                <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span>{t('createFolderAction')} <strong className="font-semibold text-gray-800">{createAction.folderName}</strong></span>
            </div>
        )
    }
    
    if (action.action === OrganizationActionType.MOVE_FILE) {
        const moveAction = action as MoveFileAction;
        return (
             <div className="flex items-center space-x-3 text-sm">
                <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="truncate flex-1">{t('moveFileAction')} <strong className="font-semibold text-gray-800">{moveAction.fileName}</strong></span>
                <TransferIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <FolderIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <strong className="font-semibold text-gray-800">{moveAction.newFolderName}</strong>
            </div>
        )
    }

    return null;
}

const OrganizationPlanModal: React.FC<OrganizationPlanModalProps> = ({ isOpen, onClose, onApply, plan, isLoading }) => {
  const { t } = useContext(LanguageContext);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-dark">{t('aiOrganizationPlanTitle')}</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-brand-secondary mb-6">{t('aiOrganizationPlanSubtitle')}</p>
        
        <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 mb-8">
            {plan && plan.length > 0 ? (
                plan.map((action, index) => <ActionItem key={index} action={action} />)
            ) : (
                <p className="text-center text-gray-500">No organization plan available.</p>
            )}
        </div>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50">
            {t('cancel')}
          </button>
          <button 
            type="button" 
            onClick={onApply}
            disabled={isLoading || !plan || plan.length === 0} 
            className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors flex items-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? t('applying') : t('applyPlan')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationPlanModal;