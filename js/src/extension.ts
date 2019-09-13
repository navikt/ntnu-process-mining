if ((window as any).require) {
  (window as any).require.config({
    map: {
      '*': {
        'ntnu-process-mining': 'nbextensions/ntnu-process-mining/index'
      }
    }
  });
}

// Export the required load_ipython_extension
export function load_ipython_extension() {}
