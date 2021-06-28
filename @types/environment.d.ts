declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    MIKRO_ORM_DB_NAME: string;
    TRANSMISSION_URL: string;
    TRANSMISSION_USERNAME: string;
    TRANSMISSION_PASSWORD: string;
  }
}
