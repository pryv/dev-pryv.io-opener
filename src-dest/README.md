# Pryv.io Open-Core

![Pryv-Logo](https://i0.wp.com/pryv.com/wp-content/uploads/2018/06/logo-data-privacy-management-pryv.png?fit=256%2C100&ssl=1)

**Personal Data & Privacy Management Software**

A ready-to-use middleware for personal data and consent management

Pryv.io is a solid foundation on which you build your own digital health solution, so you can collect, store, share and rightfully use personal data.

Maintained and developped by Pryv's developper team.



![Solution](https://pryv.com/wp-content/themes/pryv2019/assets/img/Illustration-solution@2x.jpg)

## Features 

- Provides latest Pryv.io core system ready for production.
- User registration and authentication.
- Granular consent-based access control rights.
- Data model made for privacy, aggregation and sharing [Data in Pryv](https://pryv.com/data_in_pryv/)
- FUll Data life-cycle, collect - store - change - delete.
- REST API & Socket.io.
- Ease of software integration and configuration.
- Seamless connectivity and interoperability.

## Documentation

- API Documentation & Guides: [api.pryv.com](https://api.pryv.com)
- Support pages: [support.pryv.com](https://support.pryv.com)
- More information about Pryv : [Pryv Home](https://pryv.com)

## Install & Build

### Prerequisites:

- Node v12+ [Node.js home page](https://nodejs.org/)

- Yarn v1+  - once Node.js is installed do: 
  
  ```bash
  $ npm install -g yarn
  ```
  
- MongoDB 3.6 use the following to install MongoDB

  ```bash
  $ ./script/setup-dev-env.sh
  ```



*Install and setup, run:*

-  install MongoDB 3.6 (works on OSX and Linux x86 64bit)
- `yarn setup` fetch necessary node-modules
- `yarn release` create distribution for release

### Configure your installatiom 

Pryv.io is designed to be exposed by a third party SSL temination such as `ngnix` 

#### edit ./config.json

```json
{
  "singleCoreUrl": "http://localhost:3000",
  "http": {
    "port": 3000,
    "ip": "127.0.0.1"
  },
  "auth": {
    "trustedApps": "*@http://pryv.github.io, *@https://*.rec.la"
  },
  "service": {
    "name": "Test",
    "support": "https://pryv.com/openpryv/unconfigured.html",
    "terms": "https://pryv.com/openpryv/unconfigured.html",
    "home": "https://pryv.com/openpryv/unconfigured.html",
    "eventTypes": "https://api.pryv.com/event-types/flat.json",
    "assets": {
      "definitions": "https://http://localhost:3000/wwww/assets/index.json"
    }
  }
}
```

- `singleCoreUrl` Is the "Public" URL to reach the service, usually exposed in **https** by a third party SSL service such as NGNIX.
- `http`
  - `port` The local port to listen-
  - `ip` The IP adress to use. Keep it 0.0.0.0 unless you explicitely want to expose the service in `http` to another network.
- `auth`
  - `trustedApps` list of web apps that can be trusted-app functionalities
     API for trusted apps: [API reference-full](https://api.pryv.com/reference-full/)
    see: [SETUP Guide - customize authorization](https://api.pryv.com/customer-resources/pryv.io-setup/#customize-authorization-registration-and-reset-password-apps)
- `service` [API documention on Service Information](https://api.pryv.com/reference/#service-info)

### run 

- `yarn database &` start mongodb
- `yarn api` start the API server on port 3000 (default)

## Contributing

Pryv.io core is developped and maintained by Pryv's team. You may contact us to submit a change or adaptation but do not be offended if we decline it or decide to re-write it.

## License

.. to be added

