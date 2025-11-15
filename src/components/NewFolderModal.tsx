import React, { useState, useContext, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreate(folderName.trim());
      setFolderName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-dark">{t('createNewFolderTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-light">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">{t('folderName')}</label>
            <input ref={inputRef} type="text" id="folderName" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder={t('folderName')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary" required />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">{t('cancel')}</button>
            <button type="submit" disabled={isSubmitting || !folderName.trim()} className="px-5 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-semibold">{isSubmitting ? t('creating') : t('create')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;