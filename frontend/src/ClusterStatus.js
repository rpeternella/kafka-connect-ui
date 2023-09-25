import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import './styles/ClusterStatus.css';

function ClusterStatus() {
  const [clusterStatus, setClusterStatus] = useState(null);
  const { env, clusterName } = useParams();

  useEffect(() => {
    const fetchClusterStatus = async () => {
      const response = await axios.get(`/cluster/${env}/${clusterName}`);
      setClusterStatus(response.data);
    };

    fetchClusterStatus();
  }, [env, clusterName]);

  if (!clusterStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{clusterName} Status</h2>
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Version</td>
            <td>{clusterStatus.version}</td>
          </tr>
          <tr>
            <td>Commit</td>
            <td>{clusterStatus.commit}</td>
          </tr>
          <tr>
            <td>Kafka Cluster ID</td>
            <td>{clusterStatus.kafka_cluster_id}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ClusterStatus;