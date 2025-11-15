import React, { useState, useContext } from 'react';
import { CloudProvider } from '../types';
import { LanguageContext } from '../contexts/LanguageContext';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (provider: CloudProvider, email: string) => Promise<void>;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose, onAddAccount }) => {
  const { t } = useContext(LanguageContext);
  const [provider, setProvider] = useState<CloudProvider>(CloudProvider.GoogleDrive);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    setIsSubmitting(true);
    await onAddAccount(provider, email);
    setIsSubmitting(false);
    setEmail('');
    setProvider(CloudProvider.GoogleDrive);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-dark">{t('connectNewAccountTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-2">{t('cloudService')}</label>
            <select
              id="provider"
              name="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as CloudProvider)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            >
              {Object.values(CloudProvider).map(p => (
                <option key={p} value={p}>{t(`provider_${p}`)}</option>
              ))}
            </select>
          </div>
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('accountEmail')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSubmitting || !email} className="px-5 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors">
              {isSubmitting ? t('connecting') : t('connectAccount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;