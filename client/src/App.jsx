import React, { useState } from 'react';
import Header from './components/Header';
import ChatTab from './components/ChatTab';
import FlowMapTab from './components/FlowMapTab';
import FioriLaunchpadTab from './components/FioriLaunchpadTab';
import VkoaTab from './components/VkoaTab';
import ObycTab from './components/ObycTab';
import AbapConverterTab from './components/AbapConverterTab';
import MigrationTab from './components/MigrationTab';
import SproTreeTab from './components/SproTreeTab';
import SpecTab from './components/SpecTab';
import ErrorsTab from './components/ErrorsTab';
import TablesTab from './components/TablesTab';
import RoiTab from './components/RoiTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'flowmap' && <FlowMapTab />}
        {activeTab === 'fiori' && <FioriLaunchpadTab />}
        {activeTab === 'vkoa' && <VkoaTab />}
        {activeTab === 'obyc' && <ObycTab />}
        {activeTab === 'abap' && <AbapConverterTab />}
        {activeTab === 'migration' && <MigrationTab />}
        {activeTab === 'spro' && <SproTreeTab />}
        {activeTab === 'spec' && <SpecTab />}
        {activeTab === 'errors' && <ErrorsTab />}
        {activeTab === 'tables' && <TablesTab />}
        {activeTab === 'roi' && <RoiTab />}
      </main>
    </div>
  );
}
