# Pinster

Pinster is a location-based memory content management system. Users are able to create pins using the Google Maps API, which is included in the application, and then add memories to the location.

## Installation

####To install Pinster, make sure that you have forked and cloned this repository onto your local machine.

The current repository will provide the front-end framework for the application, which is written in vanilla Javascript.

####You must additionally fork and clone the repository at `https://github.com/cristalcodes/pin-it-backend` .

This respository will provide the backend framework that is necessary for running the application. It is written in Ruby using the Ruby on Rails framework.

Google Maps is a free API, and should not require a key if you are using on your local computer and are making less than one thousand requests to the API per day. If you do, however, need to make 1k+ requests to the API, please obtain a key by visiting `https://developers.google.com/maps/documentation/javascript/get-api-key` and following the instructions.


## Usage

Once installed, simply type in the command `open index.html` to load the application in a new browser tab or window. Your backend rails server should be running concurrently in order for the application to run as desired.

####In a separate terminal tab/window...
From your back-end, run the command

`bundle install` to make sure all code and gem dependencies are resolved.

Then, run

`rails s` to get your local server running.

Once the application is loaded, follow the on screen instructions to add pins and create memories.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
