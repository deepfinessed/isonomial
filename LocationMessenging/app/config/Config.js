const devConfig = {
  BASE_URI: 'http://local.dockertoolbox.tiangolo.com/',
  BASE_API_URI: 'http://local.dockertoolbox.tiangolo.com/api/',
  GEOLOCATION_DISTANCE_FILTER: 5000, //meters to repeat geolocation calls
  GEOLOCATION_CACHE_AGE: 1000 * 60 * 60 * 24, //max ms to return cached position
  POSTS_PER_PAGE: 20,
};

const prodConfig = {
  BASE_URI: 'https://isonomial.com/',
  BASE_API_URI: 'https://isonomial.com/api/',
  GEOLOCATION_DISTANCE_FILTER: 5000, //meters to repeat geolocation calls
  GEOLOCATION_CACHE_AGE: 1000 * 60 * 60 * 24, //max ms to return cached position
  POSTS_PER_PAGE: 20,
};

const Config = devConfig;

export default Config;
