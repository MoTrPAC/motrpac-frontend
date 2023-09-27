terraform {
  # The modules used in this example have been updated with 0.12 syntax, additionally we depend on a bug fixed in
  # version 0.12.7.
  required_version = ">= 0.12.7"

  backend "gcs" {
    bucket = "motrpac-tf-state"
    prefix = "motrpac-frontend"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.84.0"
    }
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY A CLOUD RUN SERVICE
# ---------------------------------------------------------------------------------------------------------------------

resource "google_artifact_registry_repository" "repo" {
  for_each = var.env_configs
  provider = google-beta

  location = var.artifact_registry_region
  project  = each.value.project

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
  project     = each.value.project

  github {
    owner = "MoTrPAC"
    name  = "motrpac-frontend"

    dynamic pull_request {
      for_each = each.value.pull_request == null ? {} : each.value.pull_request
      content {
        branch = pull_request.value
      }
    }
    dynamic push {
      for_each = each.value.push == null ? {} : each.value.push
      content {
        branch = push.value
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

resource "google_service_account" "main" {
  for_each   = var.env_configs
  account_id = "motrpac-frontend-${each.key}"
  project    = each.value.project
}

resource "google_artifact_registry_repository_iam_member" "allow_cr" {
  for_each   = var.env_configs
  repository = google_artifact_registry_repository.repo[each.key].name
  role       = each.value.project
  member     = "serviceAccount:${google_service_account.main[each.key].email}"
}

# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY A CLOUD RUN SERVICE
# ---------------------------------------------------------------------------------------------------------------------

resource "google_cloud_run_service" "service" {
  for_each = var.env_configs
  name     = "${var.service_name}-${each.key}"
  project  = each.value.project
  location = var.cloud_run_region

  template {
    metadata {
      annotations = {
        "client.knative.dev/user-image"    = "${var.artifact_registry_region}-docker.pkg.dev/${each.value.project}/${var.service_name}-${each.key}"
        "autoscaling.knative.dev/minScale" = 1
      }
    }

    spec {
      service_account_name = google_service_account.main[each.key].name
      containers {
        image = "${var.artifact_registry_region}-docker.pkg.dev/${each.value.project}/${var.service_name}-${each.key}"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# ---------------------------------------------------------------------------------------------------------------------
# EXPOSE THE SERVICE PUBLICLY
# We give all users the ability to invoke the service.
# ---------------------------------------------------------------------------------------------------------------------

resource "google_cloud_run_service_iam_member" "allUsers" {
  for_each = google_cloud_run_service.service
  service  = each.value.name
  location = each.value.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
