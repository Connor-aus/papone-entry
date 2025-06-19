import axios from 'axios';
import logger from '../utils/logger';

// Define API base URL - replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const API_KEY = process.env.REACT_APP_API_KEY || '';

console.log('API_BASE_URL', API_BASE_URL);

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY || '',
  },
});

// Add logging for all requests
apiClient.interceptors.request.use(
  (config) => {
    logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('API Request Error: ', error);
    return Promise.reject(error);
  }
);

// Add logging for all responses
apiClient.interceptors.response.use(
  (response) => {
    logger.info(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    logger.error('API Response Error: ', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Send message to agent
export const sendRequestToAgent = async (message: string) => {
  try {
    const response = await apiClient.post('/agent', { message });
    return response.data;
  } catch (error) {
    logger.error('Error sending request to agent: ', error);
    throw error;
  }
};

// Send contact form
export const contactConnor = async (subject: string, message: string, email: string) => {
  try {
    logger.info('Sending request to Connor: ' + apiClient.getUri());
    const response = await apiClient.post('/contact', { subject, message, email });
    logger.info('Response from Connor: ' + response);
    return response.data;
  } catch (error) {
    logger.error('Error sending contact form: ', error);
    throw error;
  }
};

export default apiClient; 