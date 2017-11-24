  $(function () {
  	function log(message) {
  		$("<div>").text(message).prependTo("#log");
  		$("#log").scrollTop(0);
  	}

  	$("#input-0-0").autocomplete({


  		source: function (request, response) {
  			var bla = $('#input-0-0').val();
  			$.ajax({
  				url: "http://demo7663100.mockable.io/vehicle/search", //edit here with URL + bla
  				dataType: "json",
  				success: function (data) {
  					response(data.results);
  				}
  			});
  		},
  		minLength: 2,
  		select: function (event, ui) {
  			log("Selected: " + ui.item + " aka " + ui.item);
  		}
  	});
  });


  document.getElementById("cp-search").addEventListener("blur", function () {
  	if (document.getElementById("cp-search").value.length != 0){
  	document.getElementById("cp-result").style.display = "block";
	} else {
		document.getElementById("cp-result").style.display = "none";
	}
  });
