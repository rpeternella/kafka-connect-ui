from fastapi import FastAPI
import requests
import urllib3
from backend import config

app = FastAPI()
urllib3.disable_warnings(
    urllib3.exceptions.InsecureRequestWarning) if not config.VERIFY_REQUESTS else None


@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}


@app.get("/cluster/{env}/{cluster_name}")
async def get_cluster_status(env: str, cluster_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    response = requests.get(cluster_endpoint, verify=config.VERIFY_REQUESTS)
    return response.json()


@app.get("/cluster/{env}/{cluster_name}/connectors")
async def get_cluster_connectors(env: str, cluster_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    response = requests.get(
        f"{cluster_endpoint}/connectors?expand=status", verify=config.VERIFY_REQUESTS)
    return response.json()


@app.get("/cluster/{env}/{cluster_name}/connectors/{connector_name}/details")
async def get_connector_details(env: str, cluster_name: str, connector_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    _connector_details = requests.get(
        f"{cluster_endpoint}/connectors/{connector_name}", verify=config.VERIFY_REQUESTS)
    _connector_status = requests.get(
        f"{cluster_endpoint}/connectors/{connector_name}/status", verify=config.VERIFY_REQUESTS)
    connector = _connector_details.json()
    connector.update(_connector_status.json())
    return connector


@app.post("/cluster/{env}/{cluster_name}/connectors/{connector_name}/restart")
def restart_connector(env: str, cluster_name: str, connector_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    try:
        requests.post(
            f"{cluster_endpoint}/connectors/{connector_name}/restart?includeTasks=true", verify=config.VERIFY_REQUESTS)
        return {
            "message": f"Connector {connector_name} restarted.",
            "status": "success",
            "error": ""
        }
    except Exception as e:
        return {
            "message": f"Error restarting connector {connector_name}",
            "status": "error",
            "error": e
        }


@app.put("/cluster/{env}/{cluster_name}/connectors/{connector_name}/resume")
def resume_connector(env: str, cluster_name: str, connector_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    try:
        requests.put(f"{cluster_endpoint}/connectors/{connector_name}/resume",
                     verify=config.VERIFY_REQUESTS)
        return {
            "message": f"Connector {connector_name} resumed.",
            "status": "success",
            "error": ""
        }
    except Exception as e:
        return {
            "message": f"Error resuming connector {connector_name}",
            "status": "error",
            "error": e
        }


@app.put("/cluster/{env}/{cluster_name}/connectors/{connector_name}/pause")
def pause_connector(env: str, cluster_name: str, connector_name: str):
    cluster_endpoint = config.get_cluster_endpoint(env, cluster_name)
    try:
        requests.put(f"{cluster_endpoint}/connectors/{connector_name}/pause",
                     verify=config.VERIFY_REQUESTS)
        return {
            "message": f"Connector {connector_name} paused.",
            "status": "success",
            "error": ""
        }
    except Exception as e:
        return {
            "message": f"Error paused connector {connector_name}",
            "status": "error",
            "error": e
        }
