// convert swagger json to basic tests

var _ = require('lodash');
var fs = require('fs');
var stream = fs.createWriteStream('test.js');
var http = require('http');
var es6 = require('es6-promise').polyfill();
var fetch = require('isomorphic-fetch');
var url = 'http://prod.hola.aion.aol.com/swagger.php' //url to retrieve swagger api doc

function writeTest() {
  stream.write(`  it(\"should return 200 on success\", function () {\n`)
  stream.write(`    return expect(request).to.have.status(200);\n`)
  stream.write(`  });\n`)
  stream.write(`  it(\"should return JSON content type and server headers\", function () {\n`)
  stream.write(`    expect(request).to.have.header(\"server\");\n`)
  stream.write(`    expect(request).to.have.header(\"content-type\", \"application/json\");\n`)
  stream.write(`    return chakram.wait();\n`)
}

function createTest(uri, reqType, summary) {
  stream.write(`describe(\"${summary}\", function() {\n`)
  stream.write(`  before(function() {\n`)
  if (reqType == `get`) {
    stream.write(`    request = chakram.${reqType}(url + \'${uri}\', {\'headers\': {\'Accept\': "application/json; version=1.0"}})\n`)
    stream.write(`  });\n\n`)
  }
  else if (reqType == `post`) {
    stream.write(`    request = chakram.${reqType}(url + \'${uri}\',\n`)
    stream.write(`       true,\n`)
    stream.write(`       {\n`)
    stream.write(`       \'headers\': {\n`)
    stream.write(`          \'Accept\': "application/json; version=1.0"\n`)
    stream.write(`       },\n`)
    stream.write(`       \'body\': {\n`)
    stream.write(`\n`)
    stream.write(`       }\n`)
    stream.write(`    })\n`)
    stream.write(`  });\n\n`)
  }
  else if (reqType == `put`) {
    stream.write(`    request = chakram.${reqType}(url + \'${uri}\',\n`)
    stream.write(`       true,\n`)
    stream.write(`       {\n`)
    stream.write(`       \'headers\': {\n`)
    stream.write(`          \'Accept\': "application/json; version=1.0"\n`)
    stream.write(`       },\n`)
    stream.write(`       \'body\': {\n`)
    stream.write(`\n`)
    stream.write(`       }\n`)
    stream.write(`    })\n`)
    stream.write(`  });\n\n`)
  }
  else if (reqType == `delete`) {
    stream.write(`    request = chakram.${reqType}(url + \'${uri}\',\n`)
    stream.write(`       true,\n`)
    stream.write(`       {\n`)
    stream.write(`       \'headers\': {\n`)
    stream.write(`          \'Accept\': "application/json; version=1.0"\n`)
    stream.write(`       },\n`)
    stream.write(`    })\n`)
    stream.write(`  });\n\n`)
  }
  writeTest();
  stream.write(`  });\n`)
  stream.write(`});\n\n`)
}

stream.write(`var chakram = require(\'chakram\'),\n`)
stream.write(`    expect  = chakram.expect,\n`)
stream.write(`    moment  = require(\'moment\'),\n`)
stream.write(`    _       = require(\'lodash\'),\n`)
stream.write(`    config  = require(\'./config\')\n\n`)

fetch(url)
.then(function(response) {

  if (response.status >= 400) {
    throw new Error("Bad Response");
  }
  return response.json();
}).then(function(res) {
  _.forIn(res.paths, function(methods, endpoint) {
    _.forIn(methods, function(params, method) {
      createTest(endpoint, method, params.summary, params);
    });
  });

  stream.end();
});
