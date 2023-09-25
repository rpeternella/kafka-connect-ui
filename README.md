# Kafka Connect UI

Kafka Connect UI is a web tool for managing connectors inside Kafka Connect clusters deployed in your own infrastructure. It is written in JavaScript/React (Frontend) and Python/FastAPI (Backend), using the [Kafka Connect REST Interface](https://docs.confluent.io/current/connect/references/restapi.html) extensively to interact with underlying Kafka Connect Instances.

## 1. Requirements

### 1.1 Frontend

- [Node.js](https://nodejs.org/en/) 20.7 or higher
- [npm](https://www.npmjs.com/) 10.1  or higher

### 1.2 Backend

- [Python](https://www.python.org/) 3.11 or higher
- [Poetry](https://python-poetry.org/) 1.1.11 or higher
- [fastAPI](https://fastapi.tiangolo.com/) 0.103.1 or higher
- [uvicorn](https://www.uvicorn.org/) 0.23.2 or higher
- [requests](https://docs.python-requests.org/en/latest/) 2.31.0 or higher

## 2. Installation

Before installing the project, make sure you have all the requirements installed. Also clone the repository to your local machine.

### 2.1 Frontend

1. Install dependencies

    ```bash
    cd frontend
    npm install
    ```

2. Build

    ```bash
    npm run build
    ```

3. Start the server

    ```bash
    npm start
    ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### 2.2 Backend

1. Install dependencies

    ```bash
    poetry install
    ```

2. Start the uvicorn server

    ```bash
    poetry run uvicorn backend.main:app --reload
    ```

3. Your server will be running on [https://localhost:8000](http://localhost:8000) to accept requests.

## 3. Configuration

In order to connect to the clusters, you need to have connectivity available - either locally, or remotely (port-forward or an accessible IP).

Currently, the configuration has to be done in two specific places:

### [frontend/src/App.js](./frontend/src/App.js)

Here you should modify the following section:

```javascript
const environments = ['development'];
  const clustersByEnvironment = {
    development: ['dev-cluster'],
  };
```

### [backend/config.py](./backend/config.py)

Here, add some matching configuration:

```python
ENVIRONMENTS = {
  'development': {
    'dev-cluster': 'https://localhost:8083',
  },
}

VERIFY_REQUESTS = False
```

**IMPORTANT**: in the current iteration, only unverified authentication to Kafka Connect is possible - in the future using certificates will be enabled.

## 4. Usage

Once both frontend and backend are up and running, you can navigate to [http://localhost:3000](http://localhost:3000) and start using the UI.

The UI is divided into two sections; on the top, you can select the environment and cluster you want to work with. Below, you can see the following sections:

1. **Cluster Status**: check information of the selected cluster (version, etc.)

2. **Connectors**: shows the full list of connectors in the cluster, and allows you to interact with them

- Details: shows the details of the connector, including the status of all tasks
- Pause/Resume: allows you to pause/resume the connector
- Restart: allows to restarts the connector

## 5. Future work

- [ ] Add Dockerfile for easier deployment
- [ ] Add support for SSL authentication
- [ ] Move all configuration to a single folder
- [ ] Separate UI components into specific pages
- [ ] Add support for editing and redeploying connector configuration
- [ ] Add testing (unit and integration) for both frontend and backend
- [ ] UI improvements (better error handling, etc.)
- [ ] Better logging