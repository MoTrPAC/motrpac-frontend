# ---------------------------------------------------------------------------------------------------------------------
# DEPLOY A CLOUD RUN SERVICE
# ---------------------------------------------------------------------------------------------------------------------
variable "service_name" {
  description = "The name of the service to deploy"
}

variable "region" {
  description = "The region to deploy the service to"
}

variable "image_name" {
  description = "The image to deploy"
}

variable "envs" {
  description = "A list of environments that are deployed. Added as a suffix to the Cloud Run service."
  default = ["prod", "dev", "staging"]
}