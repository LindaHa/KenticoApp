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
4. Change ```kentico_site_name``` in the ```index.js``` to indicate your site name 
5. Run in your default browser
  1. (Optional) To be able to run the application in Chrome you need to allow requests to any site with ajax from any source. You can use this Chrome extension: https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?utm_source=chrome-app-launcher-info-dialog 
  2. (Optional) If using Ripple VS debugger you need to disable Cross Domain Proxy to be able to make API ajax requests

Working functionality
=======================
1. System
  1. Clear Cache
  2. Clean Unused Memory
  3. Eventlog
  4. Restart Server
  
2. Users
  1. Displaying users and their roles
  2. Adding and removing roles from users
  
2. Authorization
  1. Displaying all roles and their permissions
  2. Creating a new role
  3. Removing permissions from a role
  
Future development
=======================
1. A dropdown with sitenames so it doesn't have to be hardcoded