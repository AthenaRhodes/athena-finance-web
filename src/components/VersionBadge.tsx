import { useEffect, useState } from 'react';
import axios from 'axios';

interface ApiInfo {
  name: string;
  version: string;
  environment: string;
}

const WEB_VERSION = __APP_VERSION__;

export default function VersionBadge() {
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5203/api'}/info`)
      .then(r => setApiInfo(r.data))
      .catch(() => setApiInfo(null));
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs text-gray-600 font-mono">
      <span title="Web version">web {WEB_VERSION}</span>
      <span className="text-gray-700">|</span>
      <span title="API version">
        api {apiInfo ? apiInfo.version : '…'}
      </span>
      {apiInfo?.environment === 'Development' && (
        <span className="px-1.5 py-0.5 rounded bg-yellow-900/40 text-yellow-600 font-sans">dev</span>
      )}
    </div>
  );
}
