# Record Viewer API

This is a NestJS API application designed for managing and viewing records. It provides a robust and flexible backend solution with advanced features for data retrieval and manipulation.

## Features

The Record Viewer API offers a comprehensive set of features for interacting with records:

### 1. CRUD Operations

- **Create:** Add new records to the database.
- **Read:** Retrieve a single record by its ID or a list of records.
- **Update:** Modify existing records.
- **Delete:** Remove records from the database.

### 2. Advanced Filtering

The API supports complex and nested filtering on record fields. You can construct sophisticated queries by combining multiple filter conditions.

**Filter Structure:**

Filters are applied using the `filter` query parameter, which accepts a JSON object with the following structure:

```json
{
  "field": "fieldName",
  "operator": "operator",
  "value": "value",
  "logical_operator": "AND", // or "OR"
  "conditions": [
    // nested filter objects
  ]
}
```

**Supported Operators:**

- `ilike`: pattern matching (e.g., `"%value%"`)

**Example Filter:**

To get records where `name` is "Test" AND (`value` is 10 OR `status` is "active"):

```
/records?filter={"logical_operator":"AND","conditions":[{"field":"name","operator":"eq","value":"Test"},{"logical_operator":"OR","conditions":[{"field":"value","operator":"gt","value":10},{"field":"status","operator":"eq","value":"active"}]}]}
```

### 3. Pagination

The API provides pagination to efficiently handle large datasets.

- `page`: The page number to retrieve (default: 1).
- `limit`: The number of records per page (default: 10).

**Example:**

```
/records?page=2&limit=20
```

### 4. Sorting

You can sort the results based on one or more fields.

- `sort`: A comma-separated list of fields to sort by.
- `order`: The sort order, either `ASC` or `DESC` (default: `ASC`).

**Example:**

To sort by `name` in ascending order and then by `createdAt` in descending order:

```
/records?sort=name,createdAt&order=ASC,DESC
```

### 5. Swagger API Documentation

The API is fully documented using Swagger (OpenAPI). You can explore and test the endpoints interactively by navigating to `/api` in your browser when the application is running.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Swagger](https://swagger.io/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

This project uses a `.env` file for environment variables. Create a `.env` file in the root of the project and add the following:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_SCHEMA=public
```

## Running the Application

### Development Mode

To run the application with hot-reloading:

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`.

### Production Mode

To build and run the application for production:

```bash
npm run build
npm run start:prod
```

## Testing

### Unit Tests

```bash
npm run test
```

### End-to-End (E2E) Tests

```bash
npm run test:e2e
```

## Database Migrations

This project uses TypeORM migrations to manage the database schema.

-   **Generate a new migration:**
    ```bash
    npm run migration:generate <MigrationName>
    ```
-   **Run pending migrations:**
    ```bash
    npm run migration:run
    ```
-   **Revert the last migration:**
    ```bash
    npm run migration:revert
    ```

## License

This project is licensed under the MIT License.