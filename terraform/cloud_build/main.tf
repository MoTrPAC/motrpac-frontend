terraform {
  # The modules used in this example have been updated with 0.12 syntax, additionally we depend on a bug fixed in
  # version 0.12.7.
  required_version = ">= 0.12.7"

  required_providers {
    google = ">= 3.4"
  }
}


# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY A CLOUD RUN SERVICE
# ---------------------------------------------------------------------------------------------------------------------

resource "google_artifact_registry_repository" "repo" {
  for_each = var.env_configs
  provider = google-beta

  location = var.artifact_registry_region
  project  = var.project

  repository_id = "${var.service_name}-${each.key}"
  description   = "Contains Docker images for the MoTrPAC Frontend service"
  format        = "DOCKER"
}

# ---------------------------------------------------------------------------------------------------------------------
# CREATE A CLOUD BUILD TRIGGER
# ---------------------------------------------------------------------------------------------------------------------

resource "google_cloudbuild_trigger" "master" {
  for_each    = var.env_configs
  description = "MoTrPAC Frontend Trigger (${title(each.key)})"

  github {
    owner        = "MoTrPAC"
    name         = "motrpac-frontend"
    dynamic pull_request {
      for_each = each.value.pull_request
      content {
        branch = each.value.pull_request.branch
      }
    }
    dynamic push {
      for_each = each.value.push
      content {
        branch = each.value.push.branch
      }
    }
  }

  # These substitutions have been defined in the app's cloudbuild.yaml file.
  # See: https://github.com/MoTrPAC/motrpac-frontend/blob/130_MS_Cloud_Build_Cloud_Run/cloudbuild.yaml
  substitutions = {
    _CR_REGION    = var.cloud_run_region
    _AR_REGION    = var.artifact_registry_region
    _SERVICE_NAME = var.service_name
    _ENV          = each.key
  }

  # The filename argument instructs Cloud Build to look for a file in the root of the repository.
  # Either a filename or build template (below) must be provided.
  filename = "cloudbuild.yaml"

  depends_on = [google_artifact_registry_repository.repo]
}
