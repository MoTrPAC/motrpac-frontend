# Deploy k8s resources to the GKE cluster with Cloud Build

# Makre sure you are using the correct project: 
## for dev, use motrpac-portal-dev 
## for prod, use motrpac-portal
Be sure to set the env variable CUBECONFIG to the corresponding config file. This is required for running the following annotation step or for deployment using kubectl.

# First associate the k8s service account to the gcp service account by running 
```
kubectl apply -f annotate_ksa.yaml
```
# Customize the host/domain name in the application.yaml file, be sure to use the exact host name for the application.

# If you want to deploy the resource to the GKE cluster using kubectl, be sure to replace the env variables in the application.yaml by corresponding values.
```
kubectl apply -f application.yaml
```
# Build the application:
## Using the cmd line:  set the var substitutions on the cmd line using:
```
gcloud builds submit --region=us-west1 --project=motrpac-portal --config cloudbuild.yaml --substitutions=SHORT_SHA=test --substitutions=_ENV=prod|dev --substitutions=_HOSTNAME=...
```
# Using the cloud build trigger:
## Set the substitutions in the trigger config console.

# Trouble shooting
## If you see some timeout errors, it might be due to the mismatch of the env var values generated in application.yaml, esp., the static ip name, service account name, image name, etc.
## Use the following cmd to check the k8s deployment logs for errors:
``` kubectl get events ```
