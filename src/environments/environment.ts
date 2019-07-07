// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  HOST: 'http://localhost:4001',
  PORT: 3001,
  REPORT_GEN_HOST: 'http://10.0.0.204:4001',
  REPORT_GEN_PORT: 4001,
  BOSCH_API_HOST: 'https://rilbosch.iosense.io'
};
