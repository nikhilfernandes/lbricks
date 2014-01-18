$("html").on("click", "body", function(e){
  var $tgt = $(e.target);

  $tgt.parents().each(function() {
  	if ($(this).is("#block-playForever") || $(this).is("#block-play")) {
    	$.ajax({
  			type: "POST",
  			url: "/play",
			});
    }
  });
});
