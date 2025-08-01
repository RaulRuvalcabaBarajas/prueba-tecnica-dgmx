import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Amplify } from 'aws-amplify';

// Configuración de Amplify con los valores de environment
console.log('Configurando Amplify con:', {
  userPoolId: environment.aws.userPoolId,
  userPoolClientId: environment.aws.userPoolWebClientId,
  identityPoolId: environment.aws.identityPoolId,
  region: environment.aws.region
});

Amplify.configure({
  aws_project_region: environment.aws.region,
  aws_cognito_region: environment.aws.region,
  aws_user_pools_id: environment.aws.userPoolId,
  aws_user_pools_web_client_id: environment.aws.userPoolWebClientId,
  aws_cognito_identity_pool_id: environment.aws.identityPoolId,
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: []
  },
  aws_cognito_verification_mechanisms: ['EMAIL']
} as any);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
