# Banking App UI

This project is a user interface for a banking application developed using React, TypeScript, Redux, and Ant Design.

## Requirements

- Node.js (v14.x or higher)
- npm (v6.x or higher) or Yarn (optional)

## Installation

Follow these steps to set up the project:

### 1. Clone the Repository

```bash
git clone https://github.com/furkanilhan/banking-app-ui.git
cd banking-app-ui
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following line:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### 3. Install Dependencies

Using npm:

```bash
npm install
```

Or with Yarn:

```bash
yarn install
```

### 4. Start the Development Server

To start the development server:

Using npm:

```bash
npm start
```

Or with Yarn:

```bash
yarn start
```

You can view the application in your browser at `http://localhost:3000`.

## Project Structure

- **src/**: Main source code directory.
  - **components/**: Reusable components.
  - **pages/**: Different page components.
  - **services/**: API service files.
  - **store/**: Redux store and related files.
- **public/**: Static files and HTML template.

## Linting and Code Formatting

The project is configured with ESLint and Prettier. You can run linting and formatting using the following commands:

### Linting

To lint your code:

Using npm:

```bash
npm run lint
```

Or with Yarn:

```bash
yarn lint
```

### Formatting

To format your code with Prettier:

Using npm:

```bash
npm run format
```

Or with Yarn:

```bash
yarn format
```

## Testing

To run the tests:

Using npm:

```bash
npm run test
```

Or with Yarn:

```bash
yarn test
```

## Building for Production

To build the project for production:

Using npm:

```bash
npm run build
```

Or with Yarn:

```bash
yarn build
```

This will create an optimized and minified build in the `build/` directory.

## Eject

If you need to customize the configuration of your React app, you can eject it:

Using npm:

```bash
npm run eject
```

Or with Yarn:

```bash
yarn eject
```

> **Warning:** The `eject` process is irreversible and will move all configuration files into your project. After ejecting, you’ll need to manage the configuration manually.

## Environment Variables

The project relies on environment variables set in the `.env` file. The following variables are available:

- **REACT_APP_API_BASE_URL**: The base URL for API requests. By default, it is set to `http://localhost:8080/api`.

## Contributing

If you'd like to contribute, please open an **issue** or submit a **pull request**.

```
This `README.md` file provides a comprehensive guide for setting up, developing, testing, and linting the project. It also includes important project details and contribution guidelines.
```




