var items = [];
var questionNumber;
var minutes = 3;
var seconds = 60;

$(function() {
  //oops!!! browser does not support html 5 storage
  if (typeof Storage == "undefined") {
    $("#placeholder").html("Your browser not supported");
    $("#btnNext").hide();
  } else {
    //clear the session storage
    sessionStorage.clear();
    //get the question json. will get xhr error is used in chrome, it should be from url
    $.getJSON("https://raw.githubusercontent.com/aundykmahesh/htmlquiz/master/quiz.json", function(data) {
      var htmls = "";
      //loop through questions
      $.each(data, function(json, jdata) {
        //get the question
        htmls += "<h2>" + jdata.question + "</h2>";
        //loop though options
        $.each(jdata.options, function(key, value) {
          //add options to html
          htmls +=
            "<div id=d_" +
            json +
            "_" +
            value.sortorder +
            ">" +
            "<input type='radio' value='" +
            value.value +
            "' name='r_" +
            json +
            "' id=" +
            value.sortorder +
            "  onChange='moveNext(" +
            json +
            ")'>" +
            value.value +
            "<br></div>";
        });
        //add it to item array
        items.push(htmls);
        //add to session storage the correct answer
        sessionStorage.setItem("aans_" + json, jdata.answer);
        htmls = "";
      });
      //display first question
      displayQuiz(0);
    });
  }
});
///will be called on option click
///qn = question number
function moveNext(qn) {
  //get next question number
  var nextQuestion = parseInt($("#hQuestionNumber").val()) + 1;
  //store the current question answer
  sessionStorage.setItem(
    "oans_" + qn,
    $("input[name=r_" + qn + "]:checked").attr("id")
  );
  ///if last question then display results else move to next question
  if (nextQuestion == items.length) {
    displayResults();
  } else {
    setTimeout(function() {
      displayQuiz(nextQuestion);
    }, 1000);
  }
}
///Display next question with options
function displayQuiz(questionNumber) {
  $("#phquestionnumber").html("Question " + (questionNumber + 1));
  $("#placeholder").html(items[questionNumber]);
  $("#hQuestionNumber").val(questionNumber);
}
//This function displays the results 
///This will be called once time out event occured or user completes answering
function displayResults() {
  //clear the div to display the results
  $("#placeholder").empty();
  //Stop the timer
  clearInterval(t);
  //for calculating the correct answer count
  var correctAnswerCount = 0;
  //loop through all the questions and display all the questions / options / correct answer / wrong answer
  for (i = 0; i <= items.length - 1; i++) {
    $("#placeholder").append(items[i]);
    //in order to select the selcted answers session storage should have values (i.e.) handling timeout scenario
    if (sessionStorage.getItem("oans_" + (i + 1))) {
      //mark the selected anweres and disable the option
      $(
        "input[name=r_" +
          (i + 1) +
          "]:eq(" +
          (sessionStorage.getItem("oans_" + (i + 1)) - 1) +
          ")"
      ).attr({ checked: "checked", disabled: "disabled" });
      //mark css for correct answer
      $("#d_" + (i + 1) + "_" + sessionStorage.getItem("aans_" + (i + 1)))
        .addClass("correctanswer")
        .append("correct Answer");
      //mark css for wrong answer
      $("#d_" + (i + 1) + "_" + sessionStorage.getItem("oans_" + (i + 1)))
        .not(".correctanswer")
        .addClass("wronganswer")
        .append("Wrong Answer");
    } else {
      //mark as not answered
      $("div[id ^= 'd_" + (i + 1) + "_']").addClass("notanswered");
    }
    //disable all the radio buttons
    $("input[type=radio]").attr("disabled", "disabled");
    if (
      sessionStorage.getItem("aans_" + (i + 1)) ==
      sessionStorage.getItem("oans_" + (i + 1))
    ) {
      correctAnswerCount += 1;
    }
  }
  displayProgress(correctAnswerCount);
}
//timer function
var t = setInterval(function() {
  seconds -= 1;
  //format the seconds
  if (seconds.toString().length == 1) seconds = "0" + seconds;
  //display timer
  $("#lbltimer").html(
    "Total time spend - " + Math.round(minutes) + ":" + seconds
  );
  //timeout event
  if (minutes == 0 && seconds == "00") {
    displayResults();
  }
  //warn the user if less than 1 minute
  if (minutes == 1 && seconds == "00") {
    $("#lbltimer").css("color", "red");
  }
  //timer functions
  if (seconds == 0) {
    seconds = 60;
    minutes -= 1;
  }
}, 1000);
//display the result
function displayProgress(correctAnswerCount) {
  $("#phquestionnumber").html(
    "You answered " +
      correctAnswerCount +
      " out of " +
      items.length +
      " Correctly"
  );
}
