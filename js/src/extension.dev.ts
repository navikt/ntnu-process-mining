if ((window as any).require) {
  (window as any).require.config({
    map: {
      '*': {
        'ntnu-process-mining': 'http://localhost:8080/index.js'
      }
    }
  });
}

// Export the required load_ipython_extension
export function load_ipython_extension() {}
