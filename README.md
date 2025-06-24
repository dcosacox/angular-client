
# Server

Execute the Visual Studio solution, it will open the swagger tool

https://localhost:7056/swagger/index.html

Check the port allocated (In my case it's 7056 ) and update proxy.conf.json on client if needed

{
  "/api": {
    "target": "https://localhost:7056",  <-- Update here
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}

# Client

install using nmp install

run using:

ng serve --configuration proxydev --verbose

Enjoy!

For any question you can call me at 054-2663003