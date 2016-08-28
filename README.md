KenticoApp
=======================
hybrid mobile application based on Apache Cordova and jQuery Mobile

Supported Platforms
=======================
Android

How to build and debug the application on your machine
=======================
1. Clone the repository to your local machine
2. Open ```KenticoApp.sln``` in VS
3. Change ```system_api_domain``` in the ```index.js``` to point to your API domain
4. Run in your default browser
  1. (Optional) To be able to run the application in Chrome you need to allow requests to any site with ajax from any source. You can use this Chrome extension: https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-app-launcher-info-dialog 
  2. (Optional) If using Ripple VS debugger you need to disable Cross Domain Proxy to be able to make API ajax requests

Working functionality
=======================
1. System
  1. Clear Cache
  2. Eventlog
  3. Restart Server