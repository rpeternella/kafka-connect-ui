import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './styles/Connectors.css';

function Connectors() {
  const { env, clusterName } = useParams();
  const [connectors, setConnectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectorFilter, setConnectorFilter] = useState('ALL');
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [restartStatus, setRestartStatus] = useState('ALL');
  const navigate = useNavigate();

  const fetchConnectors = async () => {
    try {
      const response = await axios.get(`/cluster/${env}/${clusterName}/connectors`);
      const parsedStatus = Object.entries(response.data).map(([key, value]) => ({
        key,
        name: value.status.name,
        state: value.status.connector.state,
        taskState: value.status.tasks[0].state
      }));
      setConnectors(parsedStatus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnectors();
  }, [env, clusterName]);
    

  const filteredConnectors = connectors.filter(connector => {
    const connectorName = connector.name.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    const connectorFilterLower = connectorFilter.toLowerCase();
    const taskFilterLower = taskFilter.toLowerCase();
  
    if (searchTermLower && !connectorName.includes(searchTermLower)) {
      return false;
    }
  
    if (connectorFilterLower !== 'all' && connector.state.toLowerCase() !== connectorFilterLower) {
      return false;
    }
  
    if (taskFilterLower !== 'all' && connector.taskState.toLowerCase() !== taskFilterLower) {
      return false;
    }
  
    return true;
  });

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };
  
  const handleConnectorFilter = event => {
    setConnectorFilter(event.target.value);
  };
  
  const handleTaskFilter = event => {
    setTaskFilter(event.target.value);
  };

  const handleDetails = connectorName => {
    navigate(`/cluster/${env}/${clusterName}/connectors/${connectorName}`);
  };

  const handlePause = connectorName => {
    axios.put(`/cluster/${env}/${clusterName}/connectors/${connectorName}/pause`)
    .then(response => {
      if (response.status === 200) {
        // set the responseStatus variable with the contents of the response
        setRestartStatus(response.data);
        fetchConnectors();
      } else {
        throw new Error('Failed to pause connector');
      }
    })
    .catch(error => console.log(error));
  };

  const handleResume = connectorName => {
    axios.put(`/cluster/${env}/${clusterName}/connectors/${connectorName}/resume`)
    .then(response => {
      if (response.status === 200) {
        // set the responseStatus variable with the contents of the response
        setRestartStatus(response.data);
        fetchConnectors();
      } else {
        throw new Error('Failed to resume connector');
      }
    })
    .catch(error => console.log(error));
  };

  const handleRestart = connectorName => {
    axios.post(`/cluster/${env}/${clusterName}/connectors/${connectorName}/restart`)
      .then(response => {
        if (response.status === 200) {
          // set the responseStatus variable with the contents of the response
          setRestartStatus(response.data);
          fetchConnectors();
        } else {
          throw new Error('Failed to restart connector');
        }
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      {restartStatus.status === 'success' && <div className="restart-success-message">{restartStatus.message}</div>}
      {restartStatus.status === 'error' && <div className="restart-error-message">{restartStatus.message}: {restartStatus.error}</div>}
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" id="search" value={searchTerm} onChange={handleSearch} />
      </div>
      <div>
        <label htmlFor="connector-filter">Filter by Connector Status:</label>
        <select id="connector-filter" value={connectorFilter} onChange={handleConnectorFilter}>
          <option value="ALL">All</option>
          <option value="RUNNING">Running</option>
          <option value="PAUSED">Paused</option>
          <option value="RESTARTING">Restarting</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>
      <div>
        <label htmlFor="task-filter">Filter by Task Status:</label>
        <select id="task-filter" value={taskFilter} onChange={handleTaskFilter}>
          <option value="ALL">All</option>
          <option value="RUNNING">Running</option>
          <option value="PAUSED">Paused</option>
          <option value="FAILED">Failed</option>
          <option value="RESTARTING">Restarting</option>
          <option value="UNASSIGNED">Unassigned</option>
        </select>
      </div>
      <table>
        <thead>
          <h1>Connectors</h1>
          <tr>
            <th>Connector Name</th>
            <th>Task Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredConnectors.map(connector => (
            <tr key={connector.key} className={connector.taskState.toLowerCase()}> 
              <td>{connector.name}</td>
              <td className="taskState">{connector.taskState}</td>
              <td>
                <button onClick={() => handleDetails(connector.name)}>Details</button>
                <button disabled={!['RUNNING'].includes(connector.taskState)} onClick={() => handlePause(connector.name)}>Pause</button>
                <button disabled={!['PAUSED'].includes(connector.taskState)} onClick={() => handleResume(connector.name)}>Resume</button>
                <button onClick={() => handleRestart(connector.name)}>Restart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Connectors