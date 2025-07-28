import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Amplify } from 'aws-amplify';

// Configuración de Amplify con los valores de environment
Amplify.configure({
  Auth: {
    region: environment.aws.region,
    userPoolId: environment.aws.userPoolId,
    userPoolWebClientId: environment.aws.userPoolWebClientId,
    identityPoolId: environment.aws.identityPoolId,
    oauth: environment.aws.oauth,
  },
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
