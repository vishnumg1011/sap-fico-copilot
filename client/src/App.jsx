import React, { useState } from 'react';
import Header from './components/Header';
import ChatTab from './components/ChatTab';
import VkoaTab from './components/VkoaTab';
import SpecTab from './components/SpecTab';
import ErrorsTab from './components/ErrorsTab';
import TablesTab from './components/TablesTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'vkoa' && <VkoaTab />}
        {activeTab === 'spec' && <SpecTab />}
        {activeTab === 'errors' && <ErrorsTab />}
        {activeTab === 'tables' && <TablesTab />}
      </main>
    </div>
  );
}
