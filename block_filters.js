var fs = require('fs'),
Canvas = require('canvas');
var BlockFilters = function(){

	this.Filter = function(canvas, file_name, filter_names, callback){
		var self = this;
		Image = Canvas.Image  	
  	ctx = canvas.getContext('2d');  
  	 fs.readFile(file_name, function(err, squid){
  		if (err) throw err;
  		img = new Image;
  		img.src = squid;
  		ctx.drawImage(img, 0, 0, img.width, img.height);
  		canvas.toDataURL();
  		_.each(filter_names, function(filter_name){
  			self[filter_name](ctx, img)
  		});  	  	
  		callback();
  	});  	
  	
	},
	this.GrayScale = function(ctx, img){
		var imgd = ctx.getImageData(0, 0, img.width, img.height);
  	var data = imgd.data;  
  	var i, r, g, b, v;
  	for (i=0; i<data.length; i+=4) {
    	r = data[i];
    	g = data[i+1];
    	b = data[i+2];
    	v = 0.2126*r + 0.7152*g + 0.0722*b;
    	data[i] = data[i+1] = data[i+2] = v;
  	}
  	ctx.putImageData(imgd, 0, 0);

  },

  this.Invert = function(ctx, img){
  	var imgd = ctx.getImageData(0, 0, img.width, img.height);
  	var data = imgd.data;  
  	for (i=0; i<data.length; i+=4) {
    	data[i] = 255 - data[i];
    	data[i+1] = 255 - data[i+1];
    	data[i+2] = 255 - data[i+2];
  	}
  
  ctx.putImageData(imgd, 0, 0);
  },

  this.Binarize = function(ctx, img){
  	var imgd = ctx.getImageData(0, 0, img.width, img.height);
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
  },

  this.Pixelization = function(ctx, img){
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
  }


  return {
  	Filter: this.Filter,
  	GrayScale: this.GrayScale,
  	Invert: this.Invert,
  	Binarize: this.Binarize,
  	Pixelization: this.Pixelization
  }

}();

module.exports = BlockFilters;