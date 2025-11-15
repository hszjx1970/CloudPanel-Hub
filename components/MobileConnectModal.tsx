import React, { useState, useContext, useMemo, useEffect } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

const IP_STORAGE_KEY = 'cloud-hub-local-ip';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose }) => {
  const { t } = useContext(LanguageContext);
  const [localIp, setLocalIp] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedIp = localStorage.getItem(IP_STORAGE_KEY);
      if (savedIp) {
        setLocalIp(savedIp);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    }
  }, [isOpen]);

  const port = useMemo(() => window.location.port || '80', []);
  
  const qrCodeUrl = useMemo(() => {
    if (!localIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
      return '';
    }
    const connectUrl = `http://${localIp}:${port}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(connectUrl)}`;
  }, [localIp, port]);

  const handleSave = () => {
     if (localIp.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)) {
        localStorage.setItem(IP_STORAGE_KEY, localIp);
        setIsEditing(false);
     }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-dark">{t('mobileConnectTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {isEditing || !qrCodeUrl ? (
          <div>
            <p className="text-brand-secondary mb-4">{t('mobileConnectSetupSubtitle')}</p>
            <div className="text-sm bg-gray-50 p-3 rounded-lg border space-y-1 mb-4">
                <p><strong>{t('howToFindIpTitle')}</strong></p>
                <p><strong>Windows:</strong> {t('howToFindIpWindows')}</p>
                <p><strong>macOS/Linux:</strong> {t('howToFindIpMac')}</p>
            </div>
            <div className="mb-4">
              <label htmlFor="local-ip" className="block text-sm font-medium text-gray-700 mb-2">{t('localIpAddress')}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id="local-ip"
                  value={localIp}
                  onChange={(e) => setLocalIp(e.target.value)}
                  placeholder="e.g., 192.168.1.105"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                />
                <span className="p-3 bg-gray-100 border rounded-lg text-gray-600">:{port}</span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
                {t('cancel')}
              </button>
              <button type="button" onClick={handleSave} className="px-5 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 font-semibold transition-colors">
                {t('saveAndShowQr')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-brand-secondary mb-6">{t('mobileConnectScanSubtitle')}</p>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                <img src={qrCodeUrl} alt="Connection QR Code" width="200" height="200" />
                <p className="mt-2 text-sm font-semibold text-brand-dark">{t('scanToConnect')}</p>
                 <p className="text-xs text-gray-500">{localIp}:{port}</p>
            </div>
            <div className="flex justify-between items-center mt-6">
                <button onClick={() => setIsEditing(true)} className="text-sm text-brand-primary hover:underline">{t('updateIpAddress')}</button>
                <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
                  {t('close')}
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileConnectModal;