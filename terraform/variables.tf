# ---------------------------------------------------------------------------------------------------------------------
# REQUIRED PARAMETERS
# These variables are expected to be passed in by the operator.
# ---------------------------------------------------------------------------------------------------------------------

variable "cloud_run_region" {
  description = "The location (region or zone) to deploy the Cloud Run services. Note: Be sure to pick a region that supports Cloud Run."
  type        = string
}

variable "artifact_registry_region" {
  description = "Name of the GCP region where the GCR registry is located. e.g: 'us' or 'eu'."
  type        = string
}

variable "service_name" {
  description = "The name of the Cloud Run service to deploy."
  type        = string
}

variable "env_configs" {
  description = "The configuration for the triggers for each environment. The keys of these map correspond to each environment. You should specify which project each trigger is valid in"
  type        = map(object({
    project = string
    push = optional(object({
      branch = string
    }))
    pull_request : optional(object({
      branch = string
    }))
  }))
}
