// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  aws: {
    region: 'us-east-1', // Cambia a tu región preferida
    userPoolId: 'tu-user-pool-id', // Reemplazar con el UserPoolId que obtendrás del despliegue de CDK
    userPoolWebClientId: 'tu-user-pool-client-id', // Reemplazar con el ClientId que obtendrás del despliegue de CDK
    identityPoolId: 'tu-identity-pool-id', // Reemplazar con el IdentityPoolId que obtendrás del despliegue de CDK
    oauth: {
      domain: 'tu-dominio-cognito', // Opcional: solo si utilizas dominio personalizado
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'http://localhost:4200/callback',
      redirectSignOut: 'http://localhost:4200/',
      responseType: 'code',
    },
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
