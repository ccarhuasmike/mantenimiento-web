// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:7055/api',    
  //apiEdiUrl: 'https://desaapi.sistemaedi.com.pe/webAPIEDI', 
  //apiEdiUrlParking: 'https://desaapi.sistemaedi.com.pe/parking',  

  //apiEdiUrl: 'https://qaapi.sistemaedi.com.pe/webAPIEDI',
  apiEdiUrlParking: 'https://api.sistemaedi.com.pe/parking',
  apiEdiUrl: 'https://api.sistemaedi.com.pe/webAPIEDI',
  
  //apiEdiUrl: 'http://localhost:4950', 
  //apiEdiUrlParking: 'https://localhost:7128',
  project: 'tgestiona',
  azureAccountName: "edidesastorage",
  azureContaineName: "edi",
  azureSas:"sp=rwd&st=2022-02-09T20:11:23Z&se=2023-01-02T04:11:23Z&spr=https&sv=2020-08-04&sr=c&sig=EnH4RkU%2B2dmOkm8K0184tekN3QuQsBlrcATPKQOWDPI%3D",
  SecretKeyCaptcha:"6Lf6E-kjAAAAAIlRTM_4sqEgHGel0ibXx6zMyfz0",
  ClientKeyCaptcha:"6Lf6E-kjAAAAAFpFfHRXNOl2G7wEkkZRtaRHoAdR"
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
