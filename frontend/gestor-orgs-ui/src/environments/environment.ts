// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://mrdwtwq6oj.execute-api.us-west-1.amazonaws.com/prod',
  aws: {
    region: 'us-west-1', // Cambia a tu región preferida
    userPoolId: 'us-west-1_LoUJCJJk2', // Reemplazar con el UserPoolId que obtendrás del despliegue de CDK
    userPoolWebClientId: 'aknl1nvmlbg9n4j3taev74a5j', // Reemplazar con el ClientId que obtendrás del despliegue de CDK
    identityPoolId: 'us-west-1:181de8c1-74e8-47c3-90c4-bb61298ca86e', // Reemplazar con el IdentityPoolId que obtendrás del despliegue de CDK
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
