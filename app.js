var express = require('express'),
http = require('http'),
fs = require('fs'),
util = require('util');
cv = require('opencv');
var app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/play', function(req, res){  

  cv.readImage("./running.jpg", function(err, mat){    
  var i, r, g, b, v;
  var rows = mat.size()[0];
  var cols = mat.size()[1];
  for (i=0; i<rows; i+=1) {
    for (j=0; j<cols; i+=1) {
    
    r = mat.get(i,j);
    console.log(r)
    }
  }
  mat.save('./new.jpg');
  res.send('Hello');
  });

  

});

app.get('/grayscale', function(req, res){
  var cv = require('opencv');

var camera = new cv.VideoCapture(0);


setInterval(function() {

        camera.read(function(err, im) {

                im.save('/tmp/cam.png');
        });

}, 1000);
});




// app.get('/grayscale', function(req, res){
//   var Canvas = require('canvas'),
//   Image = Canvas.Image
//   , canvas = new Canvas(320, 320)
//   , ctx = canvas.getContext('2d')
//   , http = require('http');
//   fs.readFile('running.jpg', function(err, squid){
//   if (err) throw err;
//   img = new Image;
//   img.src = squid;
//   ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
//   canvas.toDataURL()
//   var pixels = ctx.getImageData(img)
//   var data = pixels.data;
//   console.log(data.inspect)
//   var i, r, g, b, v;
//   for (i=0; i<data.length; i+=4) {
//     r = data[i];
//     g = data[i+1];
//     b = data[i+2];
//     v = 0.2126*r + 0.7152*g + 0.0722*b;
//     data[i] = data[i+1] = data[i+2] = v;
//     console.log(data[i])
//   }
//   // console.log(pixels)
//   ctx.putImageData(
//     pixels,
//     0,
//     img.height / 4    
//     );
//   // ctx.drawImage(pixels, 0, 0, img.width / 4, img.height / 4);
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.end(''
//     + '<meta http-equiv="refresh" content="1;" />'
//     + '<img src="' + canvas.toDataURL() + '" />');
// });
// });

app.listen(3000);
console.log('Listening on port 3000');