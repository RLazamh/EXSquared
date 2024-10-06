# EXSquared
This repository contains the solution for EX Squared LATAM’s technical challenge. The service fetches vehicle data from XML APIs, converts it to JSON, stores it in a database, and exposes it via a GraphQL API. It includes robust error handling, testing, and Docker support for scalability and high performance.

# Project Structure Overview

This project follows a **Clean Architecture** approach, which divides the application into distinct layers to maintain separation of concerns, improve scalability, and facilitate testing.

If you want to execute the project using Docker containers, follow these instructions:

#### Running with Docker Containers ####
1. **To create and build Docker containers**
   Run the following command to clean up any existing containers, volumes, and images, then build and start new containers:
   ```bash
   npm run docker:create
   ```

2. **To start already created containers**
   If the containers have already been created and you only want to start them:
   ```bash
   npm run docker:start
   ```

- The application will be available at: [http://localhost:3050/vehicle/fetch-data](http://localhost:3050/vehicle/fetch-data)

#### Running Locally ####
If you want to execute the project locally without using Docker, follow these steps:

1. **Install Dependencies**
   Make sure you have installed all dependencies by running:
   ```bash
   npm install
   ```

2. **Run the Application**
   To run the NestJS application locally in development mode:
   ```bash
   npm run start:dev
   ```

- The application will be available at: [http://localhost:3000/vehicle/fetch-data](http://localhost:3000/vehicle/fetch-data)


## Project Layers

- **Application Layer**:
  This layer contains the business use cases and logic that interacts directly with user requests. For example, your project has:
  - `crud-vehicle.usecase.ts`: Implements the CRUD operations for vehicles.
  - `vehicle.dto.ts`: Defines the Data Transfer Objects (DTOs) used to transfer vehicle data between layers.
  - `process-vehicle-data.usecase.ts`: Handles specific vehicle data processing logic.
  
- **Domain Layer**:
  The domain layer encapsulates the core business logic, independent of any external service or framework. In your project:
  - `vehicle-dom.service.ts`: Manages the core vehicle-related business logic.

- **Infrastructure Layer**:
  This layer handles all the technical implementation details, such as database interactions:
  - `db.config.ts`: Configures the database connection.
  - `vehicle.entity.ts`: Defines the structure of the vehicle table in the database.
  - `vehicle-db.service.ts`: Handles all database interactions related to vehicles.

- **Presentation Layer**:
  The presentation layer is responsible for managing HTTP requests and directing them to the appropriate use cases. In your case:
  - `vehicle.controller.ts`: Manages incoming requests related to vehicles.
  - `vehicle.module.ts`: Organizes all vehicle-related components (controller, services, etc.) for easy management in the project.

- **Providers Layer**:
  This layer manages external services and dependencies, like external APIs:
  - `vehicle-make-id.providers.ts`: Provides external data related to vehicle makes and models.


## Technologies Used

In this project, we are using several key technologies to build a robust, scalable service:

- **NestJS**: A framework for building scalable and efficient server-side applications with TypeScript. We use this to structure the project in modules, services, and controllers, making it easy to maintain and expand.
- **Axios**: A promise-based HTTP client for fetching vehicle data from external APIs.
- **xml2js**: A library to parse XML data and convert it into JSON format, essential for handling the external API responses.
- **Mongoose**: Used to store the transformed JSON data in a NoSQL database (MongoDB). We chose MongoDB for its scalability and flexibility with JSON-like documents.
- **Bottleneck**: A rate-limiting library to handle high loads and ensure the system does not overwhelm external APIs by limiting concurrent requests.
- **EventEmitter2**: For event-driven communication within the application, useful for saving and processing batches of data.
- **Jest**: A testing framework for unit and integration tests to ensure the robustness of the service.

## Project Breakdown

### 1. XML Parsing and JSON Transformation
We have created an `XmlParserService` using **Axios** and **xml2js** to fetch and transform vehicle data from external APIs.

### 2. Data Storage
The transformed JSON data is stored in **MongoDB** using **Mongoose**. We chose NoSQL for its flexibility with handling dynamic data structures, such as vehicle data, and its horizontal scalability.

### 3. Testing
Using **Jest**, we have written comprehensive unit and integration tests to ensure code quality.


## Scripts Overview

This setup provides options for running the application in different modes and maintaining code quality and testing standards.

- **start**: Runs the application in production mode using `node dist/main`.
- **start:dev**: Runs the project in development mode with automatic file watching and restarts.
- **start:debug**: Starts the application in debug mode, allowing inspection with tools.
- **start:docker**: Runs the application in Docker containers using Docker Compose.
- **test**: Executes unit tests using Jest, focusing on files matching `.spec.ts`.
- **test:cov**: Runs unit tests with code coverage reports using Jest.

### Running Tests

- **To run unit tests without coverage**
  ```bash
  npm run test
  ```
- **To run unit tests with coverage**
  ```bash
  npm run test:cov
  ```


## Port Information

| Service    | Description                    | Port         |
|------------|--------------------------------|--------------|
| Application| NestJS Application (Container) | 3050         |
| MongoDB    | MongoDB Database (Container)   | 27017        |
| Application| NestJS Application (Local)     | 3000         |

- The application will be available at:
  - Docker: [http://localhost:3050/vehicle/fetch-data](http://localhost:3050/vehicle/fetch-data)
  - Local: [http://localhost:3000/vehicle/fetch-data](http://localhost:3000/vehicle/fetch-data)


## Endpoints Overview

| HTTP Method | Endpoint                  | Description                       |
|-------------|---------------------------|-----------------------------------|
| POST        | `/vehicle/proccess-xml`   | Processes vehicle XML data.       |
| GET         | `/vehicle/fetch-data`     | Fetches vehicle data with pagination (limit and page). |

- **POST `/vehicle/proccess-xml`**: Processes the vehicle XML data. You must provide a `trackingId` in the headers.
  - Example request:
    ```bash
    curl -X POST http://localhost:3000/vehicle/proccess-xml -H "trackingId: your_tracking_id"
    ```

- **GET `/vehicle/fetch-data`**: Fetches vehicle data. You can use query parameters for pagination (`limit` and `page`) and a `trackingId` in the headers.
  - Example request:
    ```bash
    curl -X GET "http://localhost:3000/vehicle/fetch-data?limit=100&page=1" -H "trackingId: your_tracking_id"
    ```

All rights reserved © 2024 Roger Laza. Unauthorized use, distribution, or reproduction of any part of this material is strictly prohibited.