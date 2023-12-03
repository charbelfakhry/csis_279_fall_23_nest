declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;
      SECRET_KEY: string;
    }
  }
}

export {};
