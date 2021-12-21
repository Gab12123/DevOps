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

## Installation

This application is written on NodeJS and it uses Redis database.

1. [Install NodeJS](https://nodejs.org/en/download/)

2. [Install Redis](https://redis.io/download)

3. Install application

Go to the root directory of the application (where `package.json` file located) and run:

```
npm install 
```

## Usage

1. Start a web server

From the root directory of the project run:

```
npm start
```

It will start a web server available in your browser at http://localhost:3000.

2. Create a user

Send a POST (REST protocol) request using terminal:

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"username":"sergkudinov","firstname":"sergei","lastname":"kudinov"}' \
  http://localhost:3000/user
```

It will output:

```
{"status":"success","msg":"OK"}
```

Another way to test your REST API is to use [Postman](https://www.postman.com/).

## Testing

From the root directory of the project, run:

```
npm test
```

## Author

KORKMAZ Gabrielle - gabrielle.korkmaz@edu.ece.fr
SAADI Yannis - yannis.saadi@edu.ece.fr
