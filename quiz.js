var items = [];
var questionNumber;
var minutes = 3;
var seconds = 60;

$(function() {
  if (typeof Storage == "undefined") {
    $("#placeholder").html("Your browser not supported");
    $("#btnNext").hide();
  } else {
    sessionStorage.clear();

    $.getJSON("quiz.json", function(data) {
      var htmls = "";
      $.each(data, function(json, jdata) {
        htmls += "<h2>" + jdata.question + "</h2>";
        $.each(jdata.options, function(key, value) {
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
        items.push(htmls);
        sessionStorage.setItem("aans_" + json, jdata.answer);
        htmls = "";
      });
      displayQuiz(0);
    });
    $("#btnNext").click(function() {});

    function validateAnswerSelection() {
      questionNumber = parseInt($("#hQuestionNumber").val()) + 1;
      if ($("input[name=r_" + questionNumber + "]:checked").val() == null) {
        return false;
      } else {
        return true;
      }
    }
  }

  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "quiz.json", true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == 200) {
        // .open will NOT return a value but simply returns undefined in async mode so use a callback
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }
});

function moveNext(qn) {
  // if (!validateAnswerSelection()) return false;
  var nextQuestion = parseInt($("#hQuestionNumber").val()) + 1;
  sessionStorage.setItem(
    "oans_" + qn,
    $("input[name=r_" + qn + "]:checked").attr("id")
  );
  if (nextQuestion == items.length) {
    displayResults();
  } else {
    setTimeout(function() {
      displayQuiz(nextQuestion);
    }, 1000);
  }
}

function displayQuiz(questionNumber) {
  $("#phquestionnumber").html("Question " + (questionNumber + 1));
  $("#placeholder").html(items[questionNumber]);
  $("#hQuestionNumber").val(questionNumber);
}

function displayResults() {
  $("#placeholder").empty();
  clearInterval(t);

  var correctAnswerCount = 0;
  for (i = 0; i <= items.length - 1; i++) {
    $("#placeholder").append(items[i]);
    if (sessionStorage.getItem("oans_" + (i + 1))) {
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
      $("div[id ^= 'd_" + (i + 1) + "_']").addClass("notanswered");
    }
    //mark css for not answer
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
var t = setInterval(function() {
  seconds -= 1;
  if (seconds.toString().length == 1) seconds = "0" + seconds;
  $("#lbltimer").html(
    "Total time spend - " + Math.round(minutes) + ":" + seconds
  );
  if (minutes == 0 && seconds == "00") {
    displayResults();
  }
  if (minutes == 1 && seconds == "00") {
    $("#lbltimer").css("color", "red");
  }
  if (seconds == 0) {
    seconds = 60;
    minutes -= 1;
  }
}, 1000);

function displayProgress(correctAnswerCount) {
  $("#phquestionnumber").html(
    "You answered " +
      correctAnswerCount +
      " out of " +
      items.length +
      " Correctly"
  );
}
