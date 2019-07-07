
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.5.

Run `npm install` to install all the dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Creating Device Types:

**Step 1:** Go to the Admin Panel-> Click on Device Types Menu-> Fill the device type and sensor details -> Click add device type button

**Step 2:** Click on Devices Menu -> Add Device Details -> Click Add Device

**Step 3:** Then go to the VS code.

**Step 4:** Create Module in modules/device_types: 
       `ng generate module modules/device_types/<devTypeID>`

**Step 5:** Create Component in modules/device_types:
       `ng generate component modules/device_types/<devTypeID>`

**Step 6:** Create a `<devTypeID>.routing.ts` file for this component

**Step 7:** Then go to the `app.routing.ts` file an add routing path

**Step 8:** Then go to the `sidebar.component.ts` add sidebar entry as child with mat-icon `keyboard_backspace`

NOTE: Make sure the module and path names match devTypeID





