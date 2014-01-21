var express = require('express'),
http = require('http'),
fs = require('fs'),
util = require('util');
cv = require('opencv');
Canvas = require('canvas'),
_ = require('underscore'),
block_filters = require('./block_filters');
paparazzo = require('./paparazzo');
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/public'));
app.use(express.bodyParser());

var superSocket = null;
var width = 320;
var height = 240;

io.sockets.on('connection', function (socket) {    
  superSocket = socket;
  var streamHeader = new Buffer(8);
  streamHeader.write("jsmp");
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.emit(streamHeader, {binary:true});

  socket.on('play', function (data) {
  var canvas = new Canvas(320, 320);
  var command = data.data;
  var image = data.image;  
  var callback = function(){
    socket.emit('image-data', { image: canvas.toDataURL() });  
    socket.broadcast.emit('image-data', { image: canvas.toDataURL() });        
  }
  var commands = command.split('|');
  var play = _.first(commands);
  var applFilters = function(filename){
    if(play == "play"){
      commands = _.rest(commands,1);
      var source = _.first(commands);
      if(source == "image"){
        block_filters.Filter(canvas, filename, _.rest(commands,1), callback);     
      }
    }
    else{
    }
  }
  if(!_.isUndefined(image)){
    console.log("image");
    fs.open(data.filename, 'a', 0755, function(err, fd) {
      if (err) throw err;
      fs.write(fd, data.image, null, 'Binary', function(err, written, buff) {
        fs.close(fd, function() {
            console.log('File saved successful!');
        });
      });  
      applFilters(data.filename);  
    });
  }else{
    console.log("noimage");
    applFilters("running.jpg");
  
  }
  });
});


app.get("/stream", function(req, resp){ 
  Image = Canvas.Image   
  p = new paparazzo({host: '94.86.192.168', port: 80, path: '/mjpg/video.mjpg'})
  

  p.on("update", function(image){    
    console.log("updated image")
    updatedImage = ''
    updatedImage = image;
    // name = "ik"+Math.random()+".jpg"
    // fs.open(name, 'w', 0755, function(err, fd) {
    //   if (err) throw err;
    //   fs.write(fd, image, null, 'Binary', function(err, written, buff) {
    //     fs.close(fd, function() {
    //         console.log('File saved successful!');
    //     });
    //   });  
    // });
    canvas = new Canvas(600, 600);
    ctx = canvas.getContext('2d');
    img1 = new Image;
    img1.src = image;        
    // img1.onload = function() { 
        console.log(image.length)
  
      ctx.drawImage(img1, 0, 0,img1.width, img1.height);
      superSocket.broadcast.emit("video-data", {image: canvas.toDataURL()});  
    // };
   });

  p.on("error", function(error){
    console.log (error.message)
  });

  p.start()
});

app.post("/stream", function(req, resp){
  console.log(req)
  req.on('data', function(data){
    canvas = new Canvas(320, 320);
    ctx = canvas.getContext('2d');
    img = new Image;
    img.src = data;    
    // img.onload = function() { 
      console.log("image loaded")
      ctx.drawImage(img, 0, 0,img.width, img.height);
      superSocket.broadcast.emit("video-data", {image: canvas.toDataURL()});  
    // }    
    
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





server.listen(3000);
console.log('Listening on port 3000');