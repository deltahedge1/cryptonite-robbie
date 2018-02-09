# Cryptonite App - Client Emulation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.1. 
It currently emulates both Independent Reserve and BTC Markets with a potential implementation of KPMG's Cryptonite API. 
This is purely the frontend and node backend which interfaces with the API. 

![Architecture Diagram](/blob/master/Cryptonite%20Architecture%20Diagram.jpg "Architecture Diagram")
## Getting Started

1. Clone this repository to your desktop
2. Navigate to the home directory /cryptonite, and run `npm install`
3. Navigate to /cryptonite/server and run `npm install`
4. Run `node index.js` in /cryptonite/server to start the node server
5. Run `ng serve` in /cryptonite/ for a dev server. Navigate to `http:localhost:4200/`. The app wil automatically reload if you change any of the source files. 

## Deployment

The app is deployed at 54.66.176.133.
In order to redeploy an updated version, follow these steps:
1. SSH in to the VM with the appropriate private key. User is 'ubuntu'. 
2. `cd ./cryptonite/cryptonite/`
3. `sudo pm2 stop ./index.js`
4. Pull in the updated repository from your desired source (i.e. here)
5. `ng build`
6. `sudo pm2 start ./index.js`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
