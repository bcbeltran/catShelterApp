// const cats = require('../data/cats');
// const breeds = require('../data/breeds');
const url = require('url');
const fs = require('fs');
const path = require('path');

function getContentType(url) {

    if(url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('js')) {
        return 'text/js';
    } else if (url.endsWith('png')) {
        return 'text/png';
    } else if (url.endsWith('xml')) {
        return 'text/xml';
    }

    
    module.exports = (req, res) => {
        const pathname = url.parse(req.url).pathname;
        
        fs.readFile(`./${pathname}`, (err, data)=>{
            if(err){
              res.writeHead(404, {'Content-Type': 'text/plain'});
              res.end('Error Found ')
              return 
            }
      
            res.writeHead(200, {'Content-Type': getContentType(pathname)})
            res.write(data)
            res.end()
          });
      
      
    };
}