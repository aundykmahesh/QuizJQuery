$(function() {
  if (typeof Storage == "undefined") {
    $("#placeholder").html("Your browser not supported");
    $("#btnNext").hide();
  } else {
    var items = [];

    sessionStorage.clear();
    $.getJSON(
      "https://raw.githubusercontent.com/aundykmahesh/htmlquiz/master/quiz.json",
      function(data) {
        var htmls = "";
        var questionnumber;
        $.each(data, function(json, jdata) {
          htmls += "<h2>" + jdata.question + "</h2>";
          $.each(jdata.options, function(key, value) {
            htmls +=
              "<input type='radio' value='" +
              value.value +
              "' name='r_" +
              json +
              "' sortorder=" +
              value.sortorder +
              ">" +
              value.value +
              "<br>";
          });
          // alert(htmls);
          items.push(htmls);
          sessionStorage.setItem("aans_" + json, jdata.answer);
          htmls = "";
        });
        // for (i = 0; i <= sessionStorage.length; i++) {
        //   if (sessionStorage.key(i) == "aans_" + i) {
        //     alert(sessionStorage.getItem("aans_" + i));
        //   }
        // }
        DisplayQuiz(0);
      }
    );

    $("#btnNext").click(function() {
      if (!ValidateAnswerSelection()) return false;
      var nextquestion = parseInt($("#hQuestionNumber").val()) + 1;

      sessionStorage.setItem(
        "oans_" + questionnumber,
        $("input[name=r_" + questionnumber + "]:checked").attr("sortorder")
      );
      if (nextquestion == items.length) {
        DisplayResults();
      } else {
        DisplayQuiz(nextquestion);
      }
    });

    function DisplayQuiz(questionnumber) {
      var q = parseInt(questionnumber) + 1;
      $("#phquestionnumber").html("Question " + q);
      $("#placeholder").html(items[questionnumber]);
      $("#hQuestionNumber").val(questionnumber);

      if (items.length - 1 == questionnumber) {
        $("#btnNext").val("Submit");
      }
    }

    function DisplayResults() {
      var resulthtmls = "";
      $("#placeholder").empty();
      for (i = 0; i <= sessionStorage.length; i++) {
        if (sessionStorage.key(i) == "aans_" + (i + 1)) {
          resulthtmls += items[i];
          $("#placeholder").append(items[i]);
          $(
            "input[name=r_" +
              (i + 1) +
              "]:eq(" +
              (sessionStorage.getItem("oans_" + (i + 1)) - 1) +
              ")"
          ).attr("checked", "checked");
        }
      }
    }

    function ValidateAnswerSelection() {
      questionnumber = parseInt($("#hQuestionNumber").val()) + 1;
      if ($("input[name=r_" + questionnumber + "]:checked").val() == null) {
        return false;
      } else {
        return true;
      }
    }
  }
});
