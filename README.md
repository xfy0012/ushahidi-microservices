# Ushahidi Microservices Integration

This project consists of multiple microservices designed to integrate an external survey service with the Ushahidi platform. The integration involves creating new surveys, handling webhook events, and submitting survey responses to the platform.

## Table of Contents
- [Project Structure](#project-structure)
- [Microservices Overview](#microservices-overview)
  - [Webhook Receiver Service](#webhook-receiver-service)
  - [Survey Storage Service](#survey-storage-service)
  - [Survey Response Service](#survey-response-service)
  - [Survey Creator Service](#survey-creator-service)
  - [Auth Service](#auth-service)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Webhook Receiver Service](#webhook-receiver-service-api)
  - [Survey Storage Service](#survey-storage-service-api)
  - [Survey Response Service](#survey-response-service-api)
  - [Survey Creator Service](#survey-creator-service-api)
  - [Auth Service](#auth-service-api)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is divided into five main microservices, each with its own responsibility:


## Microservices Overview

### Webhook Receiver Service
The Webhook Receiver Service listens for incoming webhook events, processes the received data, and either triggers the creation of a new survey or submits responses to an existing survey based on the presence of a `formID`.

- **Port**: 3000
- **Primary responsibility**: Handling webhook events and determining whether to create a new survey or submit a response.

### Survey Storage Service
This service is responsible for storing the mappings between form fields (keys) and their corresponding form attributes. It provides APIs to store, check, and retrieve stored form data.

- **Port**: 5002
- **Primary responsibility**: Storing and managing form key-value mappings.

### Survey Response Service
The Survey Response Service transforms user-submitted survey responses into the required format and submits them to the Ushahidi platform.

- **Port**: 3002
- **Primary responsibility**: Handling and transforming survey responses, then submitting them to the external survey platform.

### Survey Creator Service
This service transforms incoming data into a new survey format and interacts with the Ushahidi API to create the survey.

- **Port**: 3001
- **Primary responsibility**: Creating new surveys on the Ushahidi platform.

### Auth Service
The Auth Service manages the authentication process by retrieving and refreshing access tokens required for communicating with the Ushahidi platform's API.

- **Port**: 3003
- **Primary responsibility**: Providing access tokens for API requests.

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn


