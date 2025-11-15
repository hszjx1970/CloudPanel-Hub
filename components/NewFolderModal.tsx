import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { t } = useContext(LanguageContext);
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    setIsSubmitting(true);
    await onCreate(folderName.trim());
    setIsSubmitting(false);
    setFolderName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-dark">{t('createNewFolderTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">{t('folderName')}</label>
            <input
              type="text"
              id="folderName"
              name="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t('folderName')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSubmitting || !folderName.trim()} className="px-5 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors">
              {isSubmitting ? t('connecting') : t('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;
