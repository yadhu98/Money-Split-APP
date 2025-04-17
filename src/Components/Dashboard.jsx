import React ,{useState} from 'react'
import { getSplitsForUser,addSplit } from '../utils/storage';
import SplitList from './SplitList';
import NewSplit from './NewSplit';

const Dashboard = ({user,onLogout}) => {
  const [activeTab, setActiveTab] = useState('owed');
  const [showNewSplit, setShowNewSplit] = useState(false);
  const [splits, setSplits] = useState(getSplitsForUser(user.id));
  

  const refreshSplits = () => {
    setSplits(getSplitsForUser(user.id));
  };

  const handleNewSplit = (newSplit) => {
    addSplit(newSplit);
    refreshSplits();
    setShowNewSplit(false);
  };
  console.log(user)

  return (
    <div className="dashboard">
    <header>
      <h2>Welcome, {user.name}</h2>
      <button onClick={onLogout}>Logout</button>
    </header>

    <div className="tabs">
      <button
        className={activeTab === 'owed' ? 'active' : ''}
        onClick={() => setActiveTab('owed')}
      >
        You Owe
      </button>
      <button
        className={activeTab === 'owedTo' ? 'active' : ''}
        onClick={() => setActiveTab('owedTo')}
      >
        Owed To You
      </button>
    </div>
    {!showNewSplit ? (
      <>
        <button className="new-split-btn" onClick={() => setShowNewSplit(true)}>
          Create New Split
        </button>
        <SplitList
          splits={activeTab === 'owed' ? splits.owed : splits.owedTo}
          userId={user.id}
          type={activeTab}
          onUpdate={refreshSplits}
        />
      </>
    ) : (
      <NewSplit
        creator={user}
        onSave={handleNewSplit}
        onCancel={() => setShowNewSplit(false)}
      />
    )}
  </div>
  )
}

export default Dashboard