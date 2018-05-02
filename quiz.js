
$.getJSON( "quiz.json", function( data ) {
    var items = [];
    $.each( data, function( json ) {
      //items.push( "<li id='" + key + "'>" + val + "</li>" );
      alert(json);
    });
   
    // $("<ul/>", {
    //   "class": "my-new-list",
    //   html: items.join( "" )
    // }).appendTo( "body" );
  });