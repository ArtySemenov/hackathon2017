  $( function() {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }

    $( "#input-0-0" ).autocomplete({


      source: function( request, response ) {
//		var bla = $('#input-0-0').val();
        $.ajax( {
          url: "http://demo7663100.mockable.io/vehicle/search",
          dataType: "json",
          success: function( data ) {
            response( data.results );
          }
        } );
      },
      minLength: 2,
      select: function( event, ui ) {
        log( "Selected: " + ui.item + " aka " + ui.item );
      }
    } );
  } );
