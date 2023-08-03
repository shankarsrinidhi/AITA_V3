# VT Endeavors

## Overview
This repository has been configured to run with docker-compose and ngrok to simulate the production environment configuration. The stack is as follows:

- ngrok
- Client - nodejs/express
- Server - nodejs/react
- Database - postgres
- Auth - firebase

For local development, the deployment will run the client, server, and create an empty database with the table structure for the app.

**TODO:** Add dummy data to db initialization process for local.

For production, the deployment will run the client, server, and rely on aws provisioned database. You can supply the credentials in the `.env` file. 

Authorization is currently being handled by firebase for both the local and production environments.

**TODO:** local auth mock server for local development

**TODO:** replace firebase auth with more permanent solution or Incommon Federated login

## Getting Started
- clone repository
- make a copy of `.env.example` and rename to `.env`
- update `.env` with variables for your deployment setup as needed
- `docker-compose up`

Client and server will hotreload changes to source files. You can use your postrgres database administration tool of choice to view or edit the database at `localhost`.

