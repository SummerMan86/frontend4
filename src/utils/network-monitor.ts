export function monitorNetworkRequests() {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      console.time(`fetch:${url}`);
      return originalFetch.apply(this, args)
        .then(response => {
          console.timeEnd(`fetch:${url}`);
          return response;
        })
        .catch(error => {
          console.timeEnd(`fetch:${url}`);
          console.error(`Error fetching ${url}:`, error);
          throw error;
        });
    };
    
    console.log('Network monitoring enabled');
  }