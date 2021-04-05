declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'staging';
    TRANSMISSION_HOST: string;
    TRANSMISSION_PORT: string;
    TRANSMISSION_USER: string;
    TRANSMISSION_PASS: string;
  }
}
