var express = require('express');

var contacts = require('./server/route/contacts');

var app = express();

// app.use('/', routes);
app.use('/api/contacts', contacts);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'));

console.log('Listening on port: ' + app.get('port'));

module.exports = app;