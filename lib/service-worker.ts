// This file handles Service Worker functionality to enable offline functionality

// Function to initialize the Service Worker (new name)
export function initializeServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      try {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker successfully registered:", registration)
          })
          .catch((error) => {
            console.error("Error registering Service Worker:", error)
          })
      } catch (error) {
        console.error("General error registering Service Worker:", error)
      }
    })
  }
}

// Function to register the Service Worker (name required by the application)
export function registerServiceWorker() {
  // Redirect to the new function to maintain compatibility
  return initializeServiceWorker()
}

// Note: The rest of the Service Worker code should be in a separate file
// in the public/ folder to be accessible at the /service-worker.js path
