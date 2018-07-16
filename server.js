var http = require('http');
var fs   = require('fs');
var path = require('path');

/*
  Required to load ES6 modules
*/

http.createServer((request, response) => {

  const filePath = path.join(__dirname, 'public', (request.url === '/' ? '/index_with_modules.html' : request.url));
  const fileExt = path.extname(filePath);
  const contentTypes = {
    '.js':   'text/javascript',
    '.css':  'text/css',
    '.html': 'text/html'
  }
  
  const contentType = contentTypes.hasOwnProperty(fileExt) ? contentTypes[fileExt] : 'text/html'; 

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT'){
        response.writeHead(404);
        response.end('Cannot find the file requested\n');
      } else {
        response.writeHead(500);
        response.end('Internal error\n');
      }
    } else {
      response.setHeader('Content-Type', contentType)
      response.writeHead(200);
      response.end(content, 'utf-8');
    }
  });

}).listen(3000, (error) => {
  if (error) {
    console.log(error);
  } else console.log('http://localhost:3000 is live');
});
