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
  }


  return {
  	Filter: this.Filter,
  	GrayScale: this.GrayScale,
  	Invert: this.Invert,
  	Binarize: this.Binarize
  }

}();

module.exports = BlockFilters;