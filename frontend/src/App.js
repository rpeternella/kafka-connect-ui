import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/App.css';
import ClusterStatus from './ClusterStatus';
import Connectors from './Connectors';
import ConnectorDetails from './ConnectorDetails';

function App() {
  const environments = ['development'];
  const clustersByEnvironment = {
    development: ['dev-cluster'],
  };

  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');

  const handleEnvironmentChange = (event) => {
    setSelectedEnvironment(event.target.value);
    setSelectedCluster('');
  };

  const handleClusterChange = (event) => {
    setSelectedCluster(event.target.value);
  };

  const environmentOptions = environments.map((env) => (
    <option key={env} value={env}>
      {env}
    </option>
  ));

  const clusterOptions = clustersByEnvironment[selectedEnvironment]?.map((cluster) => (
    <option key={cluster} value={cluster}>
      {cluster}
    </option>
  ));

  return (
    <div className="container">
      <h1 className="title">Kafka Connect UI</h1>
      <p className="subtitle">A tool for managing Kafka Connect clusters and connectors.</p>
      <div className="select-container">
        <label htmlFor="environment-select" className="label">
          Environment:
        </label>
        <select id="environment-select" value={selectedEnvironment} onChange={handleEnvironmentChange} className="select">
          <option value="">Select an environment</option>
          {environmentOptions}
        </select>
      </div>
      <div className="select-container">
        <label htmlFor="cluster-select" className="label">
          Cluster:
        </label>
        <select id="cluster-select" value={selectedCluster} onChange={handleClusterChange} disabled={!selectedEnvironment} className="select">
          <option value="">Select a cluster</option>
          {clusterOptions}
        </select>
      </div>
      <ul className="nav">
        <li className="nav-item">
          <Link to={`/cluster/${selectedEnvironment}/${selectedCluster}`} className="nav-link" disabled={!selectedCluster}>
            Cluster Status
          </Link>
        </li>
        <li className="nav-item">
          <Link to={`/cluster/${selectedEnvironment}/${selectedCluster}/connectors`} className="nav-link" disabled={!selectedCluster}>
            Connectors
          </Link>
        </li>
      </ul>
      <Routes>
        <Route exact path="/cluster/:env/:clusterName" element={<ClusterStatus env={selectedEnvironment} clusterName={selectedCluster} />} />
        <Route exact path="/cluster/:env/:clusterName/connectors" element={<Connectors />} />
        <Route exact path="/cluster/:env/:clusterName/connectors/:connectorName" element={<ConnectorDetails />} />
      </Routes>
    </div>
  );
}


function AppWrapper() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <App />
    </Router>
  );
}

export default AppWrapper;