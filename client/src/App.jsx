import React, { useState } from 'react';
import Header from './components/Header';
import ChatTab from './components/ChatTab';
import VkoaTab from './components/VkoaTab';
import ObycTab from './components/ObycTab';
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
        {activeTab === 'vkoa' && <VkoaTab />}
        {activeTab === 'obyc' && <ObycTab />}
        {activeTab === 'spec' && <SpecTab />}
        {activeTab === 'errors' && <ErrorsTab />}
        {activeTab === 'tables' && <TablesTab />}
        {activeTab === 'roi' && <RoiTab />}
      </main>
    </div>
  );
}
