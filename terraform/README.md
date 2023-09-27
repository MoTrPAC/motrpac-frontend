# Infrastructure

There are two separate infrastructure configurations, one for setting up the CD pipeline, the other for setting up the
infrastructure to host the application.

**These modules are unfinished**

## Overview

This document describes the Terraform infrastructure for the MoTrPAC Frontend.

Terraform allows for idempotent configurations of cloud infrastructure via a readable, code-like format. Changes to this
infrastructure should only be made via modifications to this Terraform configuration!

Currently, the architecture consists of three services:

* Cloud Build for building the Docker image
* Artifact Registry repository for hosting the Docker image
* Cloud Run for serving

Terraform is an infrastructure-as-code tool that can be used to create and manage cloud resources through the use of a
declarative configuration language.

The Terraform state is the state of all the resources that Terraform manages. The state for this project is stored in
Google Cloud Storage, in the bucket `motrpac-tf-state` under the prefix `motrpac-frontend-cloudbuild`
or `motrpac-frontend-cloudrun`.

### Architecture

The architecture is defined primarily by the `env_configs` variable

This variable is a map of key-value pairs. The keys are the name of the "environment", and the values are the project
that the image/service should be deployed in, and are either `push` or `pull_request`, which define the "trigger" for
building the image.

For example in the following configuration, a if the `service_name` is `"hello-world"`, the `hello-world-dev` Docker image
will be built and deployed to the similarly named Cloud Run service, with a CD pipeline that gets triggered when a pull
request is made to the `master` branch of the repository. Similarly, the same workflow will occur
for `hello-world-staging`  in the `my-dev-project` GCP project every time a push occurs to the `dev` branch.

```terraform
dev = {
  project      = "my-dev-project"
  pull_request = {
    branch = "master"
  }
}
staging = {
  project = "my-dev-project"
  push    = {
    branch = "dev"
  }
}
```

### Getting started

In order to modify the infrastructure first clone this repository and enter this directory.

```bash
git clone git@github.com:MoTrPAC/motrpac-frontend.git
cd terraform
```

Then run the following command to initialize the Terraform environment and pull any existing state from the remote state
repository:

```bash
terraform init
terraform refresh
```

### Applying changes

**Make sure that you are using the right input `.tfvars` file for the environment you are deploying to, and that you
have switched to the correct workspace.**

**Delete any `venv/` or `node_modules/` directories before running `terraform apply`, as leaving them will cause
the deployment to slow down significantly.**

Then you may make your changes to the Terraform configuration and run the following command to view a plan of those
changes:

```bash
terraform plan
```

And to apply the changes to the Terraform infrastructure:

```bash
terraform apply
```
