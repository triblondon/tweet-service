# Tweet (service)

This is an [Origami](http://financial-times.github.io/ft-origami/) web service that fetches a tweet and outputs it using FT markup.

To use the service and for usage instructions, visit http://tweet.webservices.ft.com

## Requirements

To run this service you will need:

* NodeJS (tested on 0.10.15)
* NPM (tested on 1.3.5)
* Memcached (tested on 1.4.13)

## Installation

1. Clone this repository
1. Copy the `config.json.dist` file to `config.json` and populate it with your twitter API credentials and tweak any other settings as desired (for example, you may want to run the service on a different port)
1. Run `npm run-script prepare`, to install dependencies using NPM and bower
1. Run `npm start` to launch the server

To update to the most recent version of the service, run `npm run-script prepare` again, and then `npm stop` and `npm start`
