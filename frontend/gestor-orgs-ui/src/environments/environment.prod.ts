export const environment = {
  production: true,
  apiUrl: 'https://your-production-api-gateway-url/prod', // Reemplazar con la URL de producción de tu API Gateway
  aws: {
    region: 'us-east-1', // Región de producción
    userPoolId: 'tu-user-pool-id-prod', // UserPoolId de producción
    userPoolWebClientId: 'tu-user-pool-client-id-prod', // ClientId de producción
    identityPoolId: 'tu-identity-pool-id-prod', // IdentityPoolId de producción
    oauth: {
      domain: 'tu-dominio-cognito-prod', // Dominio de producción
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: 'https://your-production-domain.com/callback',
      redirectSignOut: 'https://your-production-domain.com/',
      responseType: 'code',
    },
  },
};
