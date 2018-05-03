
$.getJSON( "https://raw.githubusercontent.com/aundykmahesh/htmlquiz/master/quiz.json", function( data ) {
    var items = [];
    $.each( data, function( json,j2 ) {
      //items.push( "<li id='" + key + "'>" + val + "</li>" );
      alert(json);
      alert(j2.options[1].value);
      // $.each(j2.options, function(answers){
      //   alert(answers);
      // });
    });
   
    // $("<ul/>", {
    //   "class": "my-new-list",
    //   html: items.join( "" )
    // }).appendTo( "body" );
  });