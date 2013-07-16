var instructions = "<p>WASD or arrow keys to steer</p><p>Spacebar to shoot</p><p>Smaller asteroids are worth more points</p><p>Kill asteroids in rapid succession for combos</p><p>Contact me at tyler.scott.benjamin@gmail.com or check out my profile at github.com/benjamts</p>"

$( "#menu" ).html(instructions);
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
		draggable: false,
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


