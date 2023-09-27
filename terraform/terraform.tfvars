artifact_registry_region = "us-east2"

cloud_run_region = "us-east2"

service_name = "motrpac-frontend"

env_configs = {
  prod = {
    project = "motrpac-portal"
    push    = {
      branch = "master"
    }
  }
  dev = {
    project      = "motrpac-portal-dev"
    pull_request = {
      branch = "master"
    }
  }
  staging = {
    project = "motrpac-portal-dev"
    push    = {
      branch = "dev"
    }
  }
}
