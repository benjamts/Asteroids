$( "#menu" ).dialog({
  dialogClass: "no-close",
	draggable: false,
	modal: true,
	resizable: false,
	show: "fade",
	title: "Asteroids by Tyler Benjamin",
	width: "500px",
  buttons: [
    {
      text: "Start Game",
      click: function() {
        $( this ).dialog( "close" );
				new Asteroids();
      }
    }
  ]
});

var gameOver = function(menu_text) {
	$( "#menu" ).dialog({
	  dialogClass: "no-close",
		draggable: true,
		modal: true,
		resizable: false,
		show: "fade",
		title: "Game Over",
	  buttons: [
	    {
	      text: "New Game",
	      click: function() {
	        $( this ).dialog( "close" );
					new Asteroids();
	      }
	    }
	  ]
	});
	$('#menu').html(menu_text);
}


