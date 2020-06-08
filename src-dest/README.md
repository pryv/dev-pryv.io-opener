# Open Pryv.io

![Pryv-Logo](https://i0.wp.com/pryv.com/wp-content/uploads/2018/06/logo-data-privacy-management-pryv.png?fit=256%2C100&ssl=1)

**Personal Data & Privacy Management Software**

A ready-to-use service for personal data and consent management.

Pryv.io is a solid foundation on which you build your own digital health solution, so you can collect, store, share and rightfully use personal data.

Maintained and developed by Pryv.

![Solution](readme/pryv.io-ecosystem.jpg)

## Features

- Provides latest Pryv.io core system ready for production
- User registration and authentication
- Granular consent-based access control rights
- Data model made for privacy, aggregation and sharing [Data in Pryv](https://pryv.com/data_in_pryv/)
- Full data life-cycle: collect - store - change - delete
- REST & Socket.io API
- Ease of software integration and configuration
- Seamless connectivity and interoperability

## Documentation

- API Documentation & Guides: [api.pryv.com](https://api.pryv.com)
- Support pages: [support.pryv.com](https://support.pryv.com)
- More information about Pryv : [Pryv Home](https://pryv.com)

## Usage

### Prerequisites

- Node v12.13.1 [Node.js home page](https://nodejs.org/)
- Yarn v1 `npm install -g yarn`

### Install

Install script as been tested on Linux Ubuntu 16.04 LTS and MacOSX.

- `yarn setup`: (see `./script` folder for details)
  - Fetch dependencies
  - Install mongodb
  - Install service mail
  - Install assets & app-web-auth3
  - Generate random alpha-numeric adminKey
- `yarn release` create distribution for release

### Configure your installatiom

Pryv.io is designed to be exposed by a third party SSL temination such as `ngnix`.

#### edit ./config.json

```json
{
  "dnsLess": {
    "publicUrl":  "http://localhost:3000"
  },
  "http": {
    "port": 3000,
    "ip": "127.0.0.1"
  },
  "auth": {
    "adminAccessKey": "randomstring",
    "trustedApps": "*@http://pryv.github.io, *@https://*.rec.la*"
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
  },
  "services": {
    "email": {
      "enabled": {
        "welcome": true,
        "resetPassword": true
      }
    }
  }
}
```

- `publicUrl` Is the "Public" URL to reach the service, usually exposed in **https** by a third party SSL service such as NGNIX.
- `http`
  - `port` The local port to listen-
  - `ip` The IP adress to use. Keep it 0.0.0.0 unless you explicitely want to expose the service in `http` to another network.
- `auth`
  - `adminAccesskey` key to use for system calls such as `/reg/admin/users`. A random key should be generated on setup.
  - `trustedApps` list of web apps that can be trusted-app functionalities
     API for trusted apps: [API reference-full](https://api.pryv.com/reference-full/)
    see: [SETUP Guide - customize authorization](https://api.pryv.com/customer-resources/pryv.io-setup/#customize-authorization-registration-and-reset-password-apps)
- `service` [API documention on Service Information](https://api.pryv.com/reference/#service-info)
- `email` see [Options & Customization](#custom-email) bellow

### Run

All services in a single command line

- `yarn pryv`  - mail and database logs will be kept in `./var-pryv/logs/local-*.log`

Each service independently - logs will be displayed on the console

- `yarn database` start mongodb
- `yarn api` start the API server on port 3000 (default)
- `yarn mail` start the mail service

For development en debugging purposes 

- `yarn proxy` based on [rec-la](https://github.com/pryv/rec-la) will expose the server running on http://localhost:3000 with an SSL certificate on https://l.rec.la:4443 in this case you migh want to use `./configs/rec-la.json` 
- `yarn local` is the equivalent of running `yarn pryv` + `yarn proxy` and `./configs/rec-la.json`
  This setup is usefull to test pryv fully local. Once started you can test the authortiztaion process on [App-Web-Access](http://pryv.github.io/app-web-access/?pryvServiceInfoUrl=https://l.rec.la:4443/reg/service/info) the pryvServiceInfoUrl being: `https://l.rec.la:4443/reg/service/info`

### Options & Customization

#### Authentication & Registration web app.

Open Pryv.io comes packaged with [app-web-auth3](https://github.com/pryv/app-web-auth3), the web pages for app authorization, user registration and password reset.

During the set-up process it has been built and published in `./public_html/access` to customize it, refer to the README.md document in `./app-web-auth3` folder.

To publish a new build, simply copy or move the content of the generated in `./app-web-auth3/dist` in place of `./public_html/access`

#### Visual assets and icons

Your platforms visuals can be customized from `./public_html/assets/` folder, please refer to the README.md inside. These assets are a checkout from [assets-pryv.me](https://github.com/pryv/assets-pryv.me) repository.

#### E-Mails<a name="custom-email"></a>

Pryv.io sends welcome e-mail at registration and during "password lost" process.  

The emails can be send either by local sendmail (default) or SMTP. 
Note: It's pre-configured to find sendmail in `/usr/sbin/sendmail` change the configuration accordingly to your system.

This service, its documentation and mail templates can be found in the `./service-mail/` folder. 

## Contributing

Open Pryv.io is developped and maintained by Pryv's team. You may contact us to submit a change or adaptation but do not be offended if we decline it or decide to re-write it.

## License

.. to be added

