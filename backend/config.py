ENVIRONMENTS = {
  'development': {
    'dev-cluster': 'https://localhost:8083',
  },
}

VERIFY_REQUESTS = False

def get_cluster_endpoint(env, cluster_name):
    return ENVIRONMENTS[env][cluster_name]
