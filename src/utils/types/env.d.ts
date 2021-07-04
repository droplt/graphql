declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    NODE_ENV: 'development' | 'prodution';
    MIKRO_ORM_DB_NAME: string;
    TRANSMISSION_URL: string;
    TRANSMISSION_USERNAME: string;
    TRANSMISSION_PASSWORD: string;
  }
}