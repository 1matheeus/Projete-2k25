import React from 'react';
import { Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

const Header = ({ isSensorActive, isConnected }) => {
  return (
    <div className="header">
      <div className="logo">
        <Activity style={{ marginRight: '10px' }} />
        AERIS
      </div>
      <div className="status-indicators">
        <div className={`status-item ${isSensorActive ? 'active' : 'inactive'}`}>
          {isSensorActive ? <Activity size={16} /> : <AlertTriangle size={16} />}
          Status de ativação do sensor
        </div>
        <div className={`status-item ${isConnected ? 'active' : 'inactive'}`}>
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
          Status conexão internet
        </div>
      </div>
    </div>
  );
};

export default Header;
