# DevOps project

In this repository you will find all the work that we have done for this project.

## Brief

We have : 

1. Created an app based on the lab4 correction with some new features
2. Applied the CI/CD pipeline with deployment on heroku
3. Applied IaC approach with Vagrant and Ansible
4. Build a docker image of our app
5. Made container orchestration with docker-compose and Kubernetes
6. Deployed our app using Istio
7. Monitored with Prometheus and Grafana

For each task realised, we are going to describe the installation, usage and obtained results.
At the end, we will expose the encountered problems during this project.

## Tasks' description

### 1. Create a web application

For this task, we took the app of lab4 and added some features.

#### Installation

1. Install NodeJS
2. Install Redis
3. Install our application 
  - Located in userapi folder
  - Once in this folder run the following command
```bash
npm install
```

#### Usage 

1. Start the redis server and test if it is workking with those commands
```bash
redis-server
redis-cli
ping
```
If the server answer with *PONG*, it is working.

2. Start the web server 
```bash
npm start
```

You should be able to acces is on (http://localhost:3000)

#### Obtained results

Once started, you should see this in your browser  
![WebApp](images/webapp.png)

You can create a user by completing the form and click on *submit*  
If you want to see al the inserted users, click on *See all users!*  
This will display them as JSON files as you can see bellow with an exemple of what has been done  
![WebAppUsers](images/webappusers.png)
So for every user input, the result should be added to the existing list with this format : 
```json
{
      "username": "usernameInput",
      "firstname": "firstnameInput",
      "lastname": "lastnameInput"
   }
```

> **Note :** The username is the key in the database. If you input a new user with an existing username, it will update the existing one and not create a new user.  

We also implemented new tests :   

```bash
>npm test

  Configure
    ✓ load default json configuration file
    ✓ load custom configuration

  Redis
    ✓ should connect to Redis

  User
    Create
      ✓ create a new user
      ✓ passing wrong user parameters
      ✓ avoid creating an existing user
    Get
      ✓ get a user by username
      ✓ can not get a user when it does not exist

  User REST API
    POST /user
      ✓ create a new user
      ✓ pass wrong parameters
    GET /user
      ✓ get an existing user
      ✓ can not get a user when it does not exis
```

> **BONUS : All those features are bonuses that we have done to have a better user experience and enrich the given app.**  

### 2. Apply CI/CD pipeline 

#### Instalation  

We configured a CI/CD pipeline using GitHub Actions and Heroku.

This workflow is available [here](.githube/workflows/main.yml)

#### Usage 

On every push, GitHub Actions will go through this script automatically.

#### Obtained results  

We can see the reults (those are the glabal results, if we go in detail we can see every step logs):     
     
![Github Actions global result](images/githubactions.png)

On Heroku, we can as well see the deployments:  
   
![Heroku global result](images/heroku.png)

Our app is available on heroku and you can acces it via this **[link](https://devops-korkmaz-saadi.herokuapp.com)**    

> **Note :** Only the display of homepage will work because we don't have the subscription to user their datbase services

### 3. Configure and provision a virtual environment and run your application using the IaC approach

1. Configure with Vagrant: 1 VM running on any Linux distribution 
2. Provision the VM with Ansible, which includes installing and running:
  - language runtime
  - database
  - your application (use [sync folders](https://www.vagrantup.com/docs/synced-folders))
  - health check of your application

  
### 4. Build Docker image of your application & push it to Docker Hub

#### Installation  

No special installation is needed because we created a simple [Dockerfile](Dockerfile) that is able to run our app.

```dockerfile
FROM node:14
WORKDIR /usr/src/app
COPY ./userapi/package*.json ./
RUN npm install
COPY ./userapi/ .
EXPOSE 8080
CMD [ "npm", "start" ]
```

#### Usage 

You can build the image using the Dockerfile  

```bash
docker build -t dockergkz/projectdevops .
```

We tagged it following the <DOCKER_ACCOUNT_NAME>/<CUSTOM_IMAGE_NAME> syntax  

We also pushed it to Docker Hub, you can pull it then run using :

```bash
docker pull dockergkz/projectdevops
docker run -p 12345:8080 dockergkz/projectdevops
```

#### Obtained results

We created a [.dockerignore](.dockerignore) file so when we pull the image, we will need to redo npm install.  
  
We were then able to run the app and access it on (http://localhost:12345)  by mapping ports. However, you may have connections errors because redis is not on the same container. This is why we need container orcherstration.  

### 5. Make container orchestration using Docker Compose

#### Installation

No special installation is needed because we created a simple [docker-compose.yaml](docker-compose.yaml) file that is able to run redis and our app.

#### Usage 

You can run our file 

```bash
docker-compose up
```

We mapped the ports (redis : **5001** on local, **6379** in container - app: **5000** on local, **3000** in container) so that we can access it on (http://localhost:5000) once up

#### Obtained results

When running *docker-compose up* in our terminal, everything starts as it should ad you can see on this screenshot : 

![Docker compose terminal](images/docker-composeterminal.png)

Once again, when we access it we see our welcome page and this time it is working! We can add and see users as done in part 1 on our local machine.   

### 6. Make docker orchestration using Kubernetes

#### Installation

First, you will need to start minikube with a kubernetes version. 
This is the settings that we used but you can change the memory, cpu and k8s vesion with what you have/want :

```bash
minikube start --memory=4096 --cpus=2 --kubernetes-version=v1.22.2
```
Then you have to apply all Manifest YAML files, you should use this command and have the following results :  

```bash
> kubectl apply -f .
deployment.apps/nodejs created
deployment.apps/redis created
persistentvolumeclaim/pv-claim created
persistentvolume/pv-volume created
service/nodejs-services created
service/redis-services created
```

Then you have to get the services and should see something like this :  
![K8S get services](images/k8sgetservices.png)

Once obtained, you need to make sure that the clusterIP address of the redis-server service is the same as in the environment variable of redis in (k8s/deployment.yaml). If not replace it and re-apply *deployment.yaml*

When you get pods, you should obtain : 
![K8S get pods](images/k8sgetpods.png)

You shoulds also have persistent and volume claim, you can check it with :  
```bash
kubectl get pv
kubectl get pvc
```

#### Usage 

Once everything is up and running (following the installation instructions), you can access the web app on (http://192.168.99.108:30001)

> **Note!!** The address is compose of the minikube ip address, if you don't have the same, you should replace the link by *http://{YOUR-MINIKUBE-IP}:30001

#### Obtained results

You make think that we have something similar to the previous container orchestration but no, it's better!  
Thanks to pv and pvc, even if the pod stops and restart, you'll still have the users that were added earlier.  

For example, we added a user "TEST", stopped the app and restarted it, we stille had our user as you can see on this screenshot :  
![K8S volume working](images/volumeuser.png)

### 7. Make a service mesh using Istio

#### Installation 

To begin, start you minikube and apply the YAML file to deploy the app and set the app gateaway:   
```bash
kubectl apply -f service.yaml
kubectl apply -f deployment.yaml
kubectl apply -f pv-claim.yaml
kubectl apply -f pv-volume.yaml
kubectl get pods //verification
kubectl get services //verification
kubectl apply -f gateway.yaml
```

Now you can install Istio : 
```bash
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
istioctl analyze //verification
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
export SECURE_INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')
echo "$INGRESS_PORT"
kubectl rollout status deployment/kiali -n istio-system
```

#### Usage 

To be able to test and use what has been installed, you need to start a minikube tunnel
```bash
minikube tunnel
```
And then you can open the kiali dashboard : 
```bash
istioctl dashboard kiali
```

#### Obtained results

On our dashboard, we can see the traffic and rout between 2 different versions of the app. 
We can shift between them, in the following screenshot we directed everything on the latest version :  
![Kiali Dashboard](images/kialidashboard.png)  
  
    
### 8. Implement Monitoring to your containerized application

1. Install Prometheus and Grafana to your K8s cluster

2. Set up monitoring with Prometheus:

  - Prometheus should contact the application (eg. homepage) and pull its status
  - You should be able to see the status of the application on Prometheus

3. Set up monitoring with Grafana:

  - Link it to the Prometheus server and display the monitored applications
  - Create alerts and trigger them by shutting down your applications.

> Note. You can imagine something different and set up monitoring (eg. memory usage, CPU time, ...)

### Problems encountered



## Author

KORKMAZ Gabrielle - gabrielle.korkmaz@edu.ece.fr  
SAADI Yannis - yannis.saadi@edu.ece.fr



