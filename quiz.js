$(function() {
  if (typeof Storage == "undefined") {
    $("#placeholder").html("Your browser not supported");
    $("#btnNext").hide();
  } else {
    var items = [];
    var minutes = 0;
    var seconds = 60;
    sessionStorage.clear();
    loadJSON(function(response) {
      var htmls = "";
      var questionnumber;
      var data = JSON.parse(response);
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
            ">" +
            value.value +
            "<br></div>";
        });
        items.push(htmls);
        sessionStorage.setItem("aans_" + json, jdata.answer);
        htmls = "";
      });
      DisplayQuiz(0);
    });

    $("input[type=radio]").change(function() {
      alert(this.id);
    });

    $("#btnNext").click(function() {
      if (!ValidateAnswerSelection()) return false;
      var nextquestion = parseInt($("#hQuestionNumber").val()) + 1;

      sessionStorage.setItem(
        "oans_" + questionnumber,
        $("input[name=r_" + questionnumber + "]:checked").attr("id")
      );
      if (nextquestion == items.length) {
        DisplayResults();
      } else {
        DisplayQuiz(nextquestion);
      }
    });

    function DisplayQuiz(questionnumber) {
      $("#phquestionnumber").html("Question " + (questionnumber + 1));
      $("#placeholder").html(items[questionnumber]);
      $("#hQuestionNumber").val(questionnumber);

      if (items.length - 1 == questionnumber) {
        $("#btnNext").val("Submit");
      }
    }

    function DisplayResults() {
      $("#placeholder").empty();
      clearInterval(t);

      var correctanswercount = 0;
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
          correctanswercount += 1;
        }
      }
      $("#btnNext").hide();
      DisplayProgress(correctanswercount);
    }

    function ValidateAnswerSelection() {
      questionnumber = parseInt($("#hQuestionNumber").val()) + 1;
      if ($("input[name=r_" + questionnumber + "]:checked").val() == null) {
        return false;
      } else {
        return true;
      }
    }

    function DisplayProgress(correctanswercount) {
      $("#phquestionnumber").html(
        "You answered " +
          correctanswercount +
          " out of " +
          items.length +
          " Correctly"
      );
    }

    var t = setInterval(function() {
      seconds -= 1;
      if (seconds.toString().length == 1) seconds = "0" + seconds;
      $("#lbltimer").html(
        "Total time spend - " + Math.round(minutes) + ":" + seconds
      );
      if (minutes == 0 && seconds == "00") {
        DisplayResults();
      }
      if (seconds == 0) {
        seconds = 60;
        minutes -= 1;
      }
    }, 1000);
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
