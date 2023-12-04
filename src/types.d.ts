declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;
      SECRET_KEY: string;
      JWT_DURATION: string;
      DB_NAME: string;
      DB_PASSWORD: string;
      DB_USERNAME: string;
      DB_PORT: string;
      DB_HOST: string;
    }
  }
}

export {};
