Enabling the use of event logs to create rich interactive process and event-flow visualisations in jupyter notebooks with a few lines of code.

## Package Install

**Prerequisites**

- [node](http://nodejs.org/)

```bash
npm install --save ntnu-process-mining
```

## Development

To start developing, run the following commands:

```
npm install
npm start
```

This will start webpack dev server which will reload the jupyter page any time there are changes to the code. Currently hot code reloading is not working, so a full page reload is needed.

## Build

To build the bundle for release or for use without webpack dev server, run `npm run build`. This will bundle the code into the `dist/` folder and into `../ntnu_process_mining/static`.
