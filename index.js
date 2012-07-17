var prompt = require('prompt')
  , Handlebars = require('handlebars')
  , fs = require('fs')
  , path = require('path')
  , exec = require('child_process').exec
  ;

fs.existsSync || (fs.existsSync = path.existsSync);

module.exports = function() {
  var pkgPath = path.join(process.cwd(), 'package.json')
    , serviceName;
  if (fs.existsSync(pkgPath)) {
    serviceName = require(pkgPath).name;
  }
  if (!serviceName) {
    serviceName = path.basename(process.cwd());
  }
  var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'service.hbs'), 'utf8'));
  prompt.message = 'upstarter';
  prompt.start();

  var schema = {
    properties: {
      name: {
        pattern: /^[a-zA-Z0-9-]+$/,
        description: 'Service name',
        message: 'Must be alpha-numeric (can have dashes)',
        required: true,
        default: serviceName
      },
      description: {
        pattern: /^[^"]+$/,
        description: 'Description',
        message: 'Must not have double quotes',
        required: false,
        default: 'A Node.js service'
      },
      start_on: {
        description: 'Start on',
        default: 'stopped networking'
      },
      stop_on: {
        description: 'Stop on',
        default: 'shutdown'
      },
      log_output: {
        description: 'Log output to /var/log/upstart/? (yes/no)',
        pattern: /^(y(es)?|n(o)?)$/,
        default: 'yes'
      },
      user: {
        pattern: /^[a-zA-Z0-9-]+$/,
        description: 'User to run as',
        message: 'Must be alpha-numeric (can have dashes)',
        required: true,
        default: 'root'
      },
      nofile_soft: {
        description: 'File descriptor limit (soft)',
        required: true,
        default: '262144'
      },
      nofile_hard: {
        description: 'File descriptor limit (hard)',
        required: true,
        default: '524288'
      },
      cwd: {
        description: 'Working directory',
        required: false,
        default: process.cwd()
      },
      cmd: {
        description: 'Command',
        required: true,
        default: 'node myapp.js'
      },
      respawn: {
        description: 'Auto-respawn? (yes/no)',
        pattern: /^(y(es)?|n(o)?)$/,
        default: 'yes'
      }
    }
  };
  prompt.get(schema, function(err, result) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    result.respawn = result.respawn.match(/^y(es)?$/) ? true : false;
    result.log_output = result.log_output.match(/^y(es)?$/) ? true : false;
    result.user = result.user === 'root' ? false : result.user;
    var confPath = '/etc/init/' + result.name + '.conf';
    fs.writeFile(confPath, template(result), function(err) {
      if (err) {
        console.error('Error writing file! (Are you root?)');
        console.error(err);
        process.exit(1);
      }
      console.log('Wrote ' + confPath);
    });
  });
};
