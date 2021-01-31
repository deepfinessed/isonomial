# Isonomial

This project is an anonymous, location based messenging application. It is a work in progress.

This repo holds 2 related projects - a React Native application housed in the LocationMessenging folder, and a python backend in the isonomial folder. 

## Running the application

1. Set up the React Native environment as shown [here.](https://reactnative.dev/docs/environment-setup)

2. From the `LocationMessenging` directory, run `npm install`

3. Use `react-native run-ios` or `react-native run-android` to see the app in emulator

## Running the backend

This backend was built using the FastAPI stack. More information can be found at https://fastapi.tiangolo.com/ or `https://github.com/tiangolo/full-stack-fastapi-postgresql`.

### Setup

1. Ensure you have python installed. It can be downloaded at https://www.python.org/downloads/.

2. Install and configure Docker and docker-compose. It can be downloaded at https://www.docker.com/get-started

3. Install Poetry: `curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -`

4. From the `app` directory, run `poetry install`.

5. Set environment variables. The backend requires a large number of environment variables to operate correctly, located in a `.env` file. For ease of setup, you can fill in the marked fields in `env_template.txt` and save it in the same directory as `.env`. 

Importantly, a Google Maps API Key is required to run the backend. You can get one by following the instructions at https://developers.google.com/maps/documentation/javascript/get-api-key.

### Running the backend

Run the application using `docker-compose up -d`