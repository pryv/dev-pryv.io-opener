
const config = {
  domain: 'fake.io',
}

module.exports = {
  get: function(key) {
    return config[key];
  },
}