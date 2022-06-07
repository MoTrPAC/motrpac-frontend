# ---------------------------------------------------------------------------------------------------------------------
# REQUIRED PARAMETERS
# These variables are expected to be passed in by the operator.
# ---------------------------------------------------------------------------------------------------------------------

variable "project" {
  description = "The project ID where all resources will be launched."
  type        = string
}

variable "cloud_run_region" {
  description = "The location (region or zone) to deploy the Cloud Run services. Note: Be sure to pick a region that supports Cloud Run."
  type        = string
}

variable "artifact_registry_region" {
  description = "Name of the GCP region where the GCR registry is located. e.g: 'us' or 'eu'."
  type        = string
}

# ---------------------------------------------------------------------------------------------------------------------
# OPTIONAL PARAMETERS
# Generally, these values won't need to be changed.
# ---------------------------------------------------------------------------------------------------------------------

variable "service_name" {
  description = "The name of the Cloud Run service to deploy."
  type        = string
  default     = "sample-docker-service"
}

variable "env_configs" {
  description = "The configuration for the triggers for each environment. These correspond to each environment"
  default     = {
    prod = {
      push = {
        branch = "master"
      }
    }
    dev = {
      pull_request = {
        branch = "master"
      }
    }
    staging = {
      push = {
        branch = "dev"
      }
    }
  }
}