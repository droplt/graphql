import { Transmission } from '@ctrl/transmission';

const { TRANSMISSION_URL, TRANSMISSION_PASSWORD, TRANSMISSION_USERNAME } =
  process.env;

const transmission = new Transmission({
  baseUrl: TRANSMISSION_URL,
  username: TRANSMISSION_USERNAME,
  password: TRANSMISSION_PASSWORD
});

export default transmission;
