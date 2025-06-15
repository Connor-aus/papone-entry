# Connor's Assistant - React Chat Application

A modern React application built with TypeScript that provides a ChatGPT-like interface and a contact form.

## Features

- **Chat Interface**: A ChatGPT-like interface with message history and input field
- **Help Menu**: Quick access to common queries with a popout help menu
- **Contact Form**: Form to send messages directly to Connor
- **Responsive Design**: Mobile-friendly interface with a matte black theme
- **API Integration**: Integration with backend APIs for chat and contact functionality

## Technology Stack

- React 18 with TypeScript
- React Router v6 for navigation
- TailwindCSS for styling
- Axios for API requests
- Jest for testing

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── services/         # API services
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/connors-assistant.git
   cd connors-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=https://your-api-endpoint.com
   REACT_APP_LOG_LEVEL=INFO
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The application uses the following environment variables:

- `REACT_APP_API_URL`: The base URL for API requests
- `REACT_APP_LOG_LEVEL`: The log level (DEBUG, INFO, WARN, ERROR)

## Deployment

### AWS S3 Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to S3:
   ```
   npm run deploy
   ```

### CI/CD with GitHub Actions

A GitHub Actions workflow is included in `.github/workflows/deploy.yml` for automated deployments.

## Testing

Run tests with:

```
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
