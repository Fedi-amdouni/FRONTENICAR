// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const env: { [s: string]: string | null } = {
  api_url: 'http://localhost:8081',
  login_url: 'http://localhost:8081/login',
  user_url:'http://localhost:8081/users',
  class_url:'http://localhost:8081/classes',
  notesCC_url:'http://localhost:8081/notesCC',
  notesExam_url:'http://localhost:8081/notesEXAMS'

  
};

export const environment = {
  production: false,
  loginUrl: env['login_url'],
  userUrl:env['user_url'],
  classUrl:env['class_url'],
  notesCCUrl:env['notesCC_url'],
  notesEXAMSUrl : env['notesExam_url']

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
