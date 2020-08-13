const express = require('express');
const app = express();
const axios = require('axios');
const promMid = require('express-prometheus-middleware');

const apiurl = "http://192.168.56.10:3000/";
///////////////////////////////////////////
//const PORT = 9091;
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
  /**
   * Uncomenting the `authenticate` callback will make the `metricsPath` route
   * require authentication. This authentication callback can make a simple
   * basic auth test, or even query a remote server to validate access.
   * To access /metrics you could do:
   * curl -X GET user:password@localhost:9091/metrics
   */
  // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
  /**
   * Uncommenting the `extraMasks` config will use the list of regexes to
   * reformat URL path names and replace the values found with a placeholder value
  */
  // extraMasks: [/..:..:..:..:..:../],
  /**
   * The prefix option will cause all metrics to have the given prefix.
   * E.g.: `app_prefix_http_requests_total`
   */
  // prefix: 'app_prefix_',
  /**
   * Can add custom labels with customLabels and transformLabels options
   */
  // customLabels: ['contentType'],
  // transformLabels(labels, req) {
  //   // eslint-disable-next-line no-param-reassign
  //   labels.contentType = req.headers['content-type'];
  // },
}));

// curl -X GET localhost:9091/hello?name=Chuck%20Norris
app.get('/hello', (req, res) => {
  console.log('GET /hello');
  const { name = 'Anon' } = req.query;
  res.json({ message: `Hello, ${name}!` });
});

///////////////////////////////////////////
app.get('/', function (req, res) {
  console.log('YOUHOU l\'index');
  res.type('html');
  //console.log(__dirname + '/public/html/index.html');
  res.sendFile(__dirname + '/public/html/index.html');
}).get('/data/getTasks', function (req, res) {
  console.log('YOUHOU getTasks');
  res.type('json');
  axios.get(apiurl + 'tasks')
    .then(function (response) {
      res.status(200).json(response.data)
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
})

app.listen(8010, function () {
  console.log('Example app listening on port 8010 !');
})
