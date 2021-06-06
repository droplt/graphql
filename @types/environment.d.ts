declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    TRANSMISSION_URL: string;
    TRANSMISSION_USERNAME: string;
    TRANSMISSION_PASSWORD: string;
  }
}
