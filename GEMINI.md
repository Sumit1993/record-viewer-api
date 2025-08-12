# Project Overview

This is a NestJS API application named `record-viewer-api` designed for managing and viewing records. It leverages TypeORM for database interactions with PostgreSQL and provides a RESTful API with advanced filtering, sorting, and pagination capabilities. The application also includes Swagger for API documentation.

**Key Features:**
- **Record Management:** Provides CRUD (Create, Read, Update, Delete) operations for records.
- **Advanced Filtering:** Supports complex filtering logic with nested conditions.
- **Pagination and Sorting:** Enables efficient retrieval of large datasets.
- **API Documentation:** Integrated with Swagger for interactive API exploration.
- **Database:** Uses PostgreSQL as the primary data store.

# Building and Running

This project uses `npm` for dependency management and script execution.

## Installation

To install the project dependencies, run:

```bash
npm install
```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run start:dev
```

## Production

To build the application for production:

```bash
npm run build
```

To run the application in production mode:

```bash
npm run start:prod
```

## Testing

To run unit tests:

```bash
npm run test
```

To run tests with coverage report:

```bash
npm run test:cov
```

To run end-to-end tests:

```bash
npm run test:e2e
```

## Database Migrations

This project uses TypeORM for database migrations. Ensure your database connection details are configured in your environment variables (e.g., `DATABASE_URL`, `DATABASE_SCHEMA`).

To generate a new migration:

```bash
npm run migration:generate <MigrationName>
```

To run pending migrations:

```bash
npm run migration:run
```

To revert the last migration:

```bash
npm run migration:revert
```

# Development Conventions

- **Language:** TypeScript
- **Framework:** NestJS
- **ORM:** TypeORM
- **Testing:** Jest for unit and e2e tests.
- **Linting and Formatting:** ESLint and Prettier are used to maintain code quality and consistency. You can run `npm run lint` to lint and fix issues, and `npm run format` to format the code.
- **Environment Variables:** Sensitive configurations like database URLs are expected to be provided via environment variables.
