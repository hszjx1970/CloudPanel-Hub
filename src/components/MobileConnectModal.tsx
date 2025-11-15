import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { Html5Qrcode } from 'html5-qrcode';

interface MobileConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isElectron: boolean;
}

const MobileConnectModal: React.FC<MobileConnectModalProps> = ({ isOpen, onClose, isElectron }) => {
  const { t } = useContext(LanguageContext);
  const [localIp, setLocalIp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const isMobile = useMemo(() => /Mobi/i.test(window.navigator.userAgent), []);
  const isDev = import.meta.env.DEV;
  const port = useMemo(() => isDev ? '5173' : (window.location.port || (window.location.protocol === 'https:' ? '443' : '80')), [isDev]);

  useEffect(() => {
    const initializeIp = async () => {
      setIsLoading(true);
      if (isElectron) {
        const ip = await window.electronAPI.getLocalIP();
        setLocalIp(ip || 'IP not found');
      }
      setIsLoading(false);
    };

    if (isOpen) initializeIp();
  }, [isOpen, isElectron]);
  
  useEffect(() => {
    if (!isOpen || !isScanning || !isMobile) return;

    scannerRef.current = new Html5Qrcode('qr-reader-container');
    const startScanner = async () => {
        try {
            await scannerRef.current!.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => { window.location.href = decodedText; },
                () => {}
            );
        } catch (err) {
            console.error("QR Scanner failed to start", err);
        }
    };
    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Failed to stop QR scanner.", err));
      }
    };
  }, [isScanning, isOpen, isMobile]);


  const qrCodeUrl = useMemo(() => {
    if (!localIp || !port) return '';
    const connectUrl = `http://${localIp}:${port}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(connectUrl)}`;
  }, [localIp, port]);

  if (!isOpen) return null;
  
  const renderDesktopView = () => (
    <>
      <p className="text-brand-secondary mb-6">{t('mobileConnectScanSubtitle')}</p>
      <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
        {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" /> : <div className="w-[200px] h-[200px] flex items-center justify-center text-sm text-gray-500">{t('loading')}...</div>}
        <p className="mt-2 text-sm font-semibold text-brand-dark">{t('scanToConnect')}</p>
        {localIp && <p className="text-xs text-gray-500">{localIp}:{port}</p>}
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">{t('close')}</button>
      </div>
    </>
  );

  const renderMobileView = () => (
    isScanning ? 
    <div>
        <div id="qr-reader-container" style={{ width: '100%' }}/>
        <button onClick={() => setIsScanning(false)} className="w-full mt-4 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">{t('cancel')}</button>
    </div>
    : 
    <div className="text-center">
      <p className="text-brand-secondary mb-6">{t('scanQrToConnect')}</p>
      <button onClick={() => setIsScanning(true)} className="w-full px-5 py-3 bg-brand-primary text-white rounded-lg hover:bg-blue-600 font-semibold">{t('scanQrCode')}</button>
    </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-brand-dark">{t('mobileConnectTitle')}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-light">&times;</button></div>
        {isLoading ? <div>{t('loading')}...</div> : (isMobile ? renderMobileView() : renderDesktopView())}
      </div>
    </div>
  );
};

export default MobileConnectModal;
