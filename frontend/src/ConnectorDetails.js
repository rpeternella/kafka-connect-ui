import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './styles/ConnectorDetails.css';

function ConnectorDetails() {
  const { env, clusterName, connectorName } = useParams();
  const [connectorStatus, setConnectorStatus] = useState(null);

  useEffect(() => {
    axios.get(`/cluster/${env}/${clusterName}/connectors/${connectorName}/details`)
      .then(response => setConnectorStatus(response.data))
      .catch(error => console.log(error));
  }, [env, clusterName, connectorName]);

  if (connectorStatus === null) {
    return <div>Loading...</div>;
  }

  const taskStatusClass = taskStatus => {
    switch (taskStatus) {
      case 'RUNNING':
        return 'status-running';
      case 'PAUSED':
        return 'status-paused';
      case 'FAILED':
        return 'status-failed';
      default:
        return '';
    }
  };

  const configRows = Object.keys(connectorStatus.config).sort().map((key) => (
    <tr key={key}>
      <td className="key">{key}</td>
      <td className="value">{connectorStatus.config[key]}</td>
    </tr>
  ));

  return (
    <div className="connector-details">
      <h1 align="center">{connectorStatus.name}</h1>
      <table>
        <tbody>
          <tr>
            <td className="key">Connector Name:</td>
            <td className="value">{connectorStatus.name}</td>
          </tr>
          <tr>
            <td className="key">Connector Type:</td>
            <td className="value">{connectorStatus.type}</td>
          </tr>
          <tr>
            <td className="key">Config:</td>
            <td className="value">
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {configRows}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td className="key">Tasks:</td>
            <td className="value">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>State</th>
                    <th>Worker ID</th>
                  </tr>
                </thead>
                <tbody>
                  {connectorStatus.tasks.map(task => (
                    <tr key={task.task}>
                      <td>{task.id}</td>
                      <td className={taskStatusClass(task.state)}>{task.state}</td>
                      <td>{task.worker_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ConnectorDetails;