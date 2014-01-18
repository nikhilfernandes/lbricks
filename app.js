var express = require('express'),
http = require('http'),
fs = require('fs'),
util = require('util');
cv = require('opencv');
var app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/grayscale', function(req, res){  

  var Canvas = require('canvas'),
  Image = Canvas.Image
  , canvas = new Canvas(320, 320)
  , ctx = canvas.getContext('2d')
  , http = require('http');
  fs.readFile('test.gif', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width/4, img.height/4);
  canvas.toDataURL()

  var imgd = ctx.getImageData(0, 0, img.width/4, img.height/4);
  var data = imgd.data;
  console.log(data.length)
  var i, r, g, b, v;
  for (i=0; i<data.length; i+=4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    v = 0.2126*r + 0.7152*g + 0.0722*b;
    data[i] = data[i+1] = data[i+2] = v;
  }

  ctx.putImageData(imgd, 0, 0);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(''
    + '<meta http-equiv="refresh" content="1;" />'
    + '<img src="' + canvas.toDataURL() + '" />');
});


});

app.get('/invert', function(req, res){  

  var Canvas = require('canvas'),
  Image = Canvas.Image
  , canvas = new Canvas(320, 320)
  , ctx = canvas.getContext('2d')
  , http = require('http');
  fs.readFile('test.gif', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width/4, img.height/4);
  canvas.toDataURL()

  var imgd = ctx.getImageData(0, 0, img.width/4, img.height/4);
  var data = imgd.data;
  console.log(data.length)
  for (i=0; i<data.length; i+=4) {
    data[i] = 255 - data[i];
    data[i+1] = 255 - data[i+1];
    data[i+2] = 255 - data[i+2];
  }
  
  ctx.putImageData(imgd, 0, 0);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(''
    + '<meta http-equiv="refresh" content="1;" />'
    + '<img src="' + canvas.toDataURL() + '" />');

  });

});

app.get('/binarize', function(req, res){  

  var Canvas = require('canvas'),
  Image = Canvas.Image
  , canvas = new Canvas(320, 320)
  , ctx = canvas.getContext('2d')
  , http = require('http');
  fs.readFile('test.gif', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width/4, img.height/4);
  canvas.toDataURL()

  var imgd = ctx.getImageData(0, 0, img.width/4, img.height/4);
  var data = imgd.data;
  var i, r, g, b, v;
  for (i=0; i<data.length; i+=4) {
    r = data[i];
    g = data[i+1];
    b = data[i+2];
    v = 0.2126*r + 0.7152*g + 0.0722*b;
        if (v > 128) {
            v = 255;
        } else {
            v = 0;
        }
    data[i] = data[i+1] = data[i+2] = v;
  }
  ctx.putImageData(imgd, 0, 0);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(''
    + '<meta http-equiv="refresh" content="1;" />'
    + '<img src="' + canvas.toDataURL() + '" />');

  });

});

app.get('/pixelization', function(req, res){  

  var Canvas = require('canvas'),
  Image = Canvas.Image
  , canvas = new Canvas(320, 320)
  , ctx = canvas.getContext('2d')
  , http = require('http');
  fs.readFile('test.gif', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width/4, img.height/4);
  canvas.toDataURL()

  var avg_colors = function(data, sx, sy, w, h, c, gsz) {
    var sum = 0.0;
    var pxl_num = 0.0; // number of pixels
    for (y = sy; y < sy+gsz; y += 1) {
        for (x = sx; x < sx+gsz; x += 1) {
            if ((x >= 0) && (x < w) && (y >= 0) && (y < h)) {
                sum += data[(y*w + x) * 4 + c];
                pxl_num += 1;
            }
        }
    }
    return sum / pxl_num;
};

  var imgd = ctx.getImageData(0, 0, img.width/4, img.height/4);
  var data = imgd.data;
  var gsz = parseInt(10); // grid_size
    var w = canvas.width;
    var h = canvas.height;
    var x = 0, y = 0;
    // for each seed (top left corner in a block)
    for (y = 0; y < h; y += gsz) {
        for (x = 0; x < w; x += gsz) {
            // calculate r, g, b for this block
            avg_r = avg_colors(data, x, y, w, h, 0, gsz);
            avg_g = avg_colors(data, x, y, w, h, 1, gsz);
            avg_b = avg_colors(data, x, y, w, h, 2, gsz);

            // assign avg r, g, b to each pixel in this block
            for (yi = y; yi < y+gsz; yi += 1) {
                for (xi = x; xi < x+gsz; xi += 1) {
                    if ((xi >= 0) && (xi < w) && (yi >= 0) && (yi < h)) {
                        data[(yi*w + xi) * 4] = avg_r;
                        data[(yi*w + xi) * 4 + 1] = avg_g;
                        data[(yi*w + xi) * 4 + 2] = avg_b;
                    }
                }
            }
        }
  }
  ctx.putImageData(imgd, 0, 0);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(''
    + '<meta http-equiv="refresh" content="1;" />'
    + '<img src="' + canvas.toDataURL() + '" />');

  });

});

app.get('/blur', function(req, res){  

  var Canvas = require('canvas'),
  Image = Canvas.Image
  , canvas = new Canvas(320, 320)
  , ctx = canvas.getContext('2d')
  , http = require('http');
  fs.readFile('test.gif', function(err, squid){
  if (err) throw err;
  img = new Image;
  img.src = squid;
  ctx.drawImage(img, 0, 0, img.width/4, img.height/4);
  canvas.toDataURL()
  var imgd = ctx.getImageData(0, 0, img.width/4, img.height/4);
  var data = imgd.data;

  var idx = function(x, y, c, w, h) {
    return ((y*w + x) * 4 + c);
};

  var blur_avg = function(data, x, y, w, h, c, bsz) {
    var s = 0.0;
    var pxl_num = 0.0;
    for (yi = y-bsz; yi <= y+bsz; yi += 1) {
        for (xi = x-bsz; xi <= x+bsz; xi += 1) {
            if ((xi >= 0) && (xi < w) && (yi >= 0) && (yi < h)) { // if within canvas size
                s += data[idx(xi, yi, c, w, h)];
                pxl_num += 1;
            }
        }
    }
    return s / pxl_num;
};

  var i;
    var w = canvas.width;
    var h = canvas.height;
    var x = 0, y = 0;
    var bsz = parseInt(3); // blur size
    for (y = 0; y < h; y += 1) {
        for (x = 0; x < w; x += 1) {
            data[(y*w + x) * 4] = blur_avg(data, x, y, w, h, 0, bsz);
            data[(y*w + x) * 4 + 1] = blur_avg(data, x, y, w, h, 1, bsz);
            data[(y*w + x) * 4 + 2] = blur_avg(data, x, y, w, h, 2, bsz);
        }
  }
  ctx.putImageData(imgd, 0, 0);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(''
    + '<meta http-equiv="refresh" content="1;" />'
    + '<img src="' + canvas.toDataURL() + '" />');

  });

});





app.listen(3000);
console.log('Listening on port 3000');