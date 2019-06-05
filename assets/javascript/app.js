$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  $('#higuys').show();
  $('#instructions').show();
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 20,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: '<img src="./assets/images/americanmade.jpg">',
    q2: '<img src="./assets/images/aquaman.jpg">',
    q3: '<img src="./assets/images/avengers.jpeg">',
    q4: '<img src="./assets/images/blackpanther.jpg">',
    q5: '<img src="./assets/images/avengersinfinitywar.jpg">',
    q6: '<img src="./assets/images/babydriver.jpg">',
    q7: '<img src="./assets/images/batmanvsuperman.jpg">',
    q8: '<img src="./assets/images/avengersageofultron.jpg">',
    q9: '<img src="./assets/images/bladerunner20492.jpg">',
    q10: '<img src="./assets/images/deadpool.jpg">',

  },
  options: {
    q1: ['American Made (2017)', 'Mission: Impossible Rogue Nation (2015)', 'Jerry Maguire (1996)', 'The Mummy (2017)'],
    q2: ['Conan the Barbarian (2011)', 'Aquaman (2018)', 'Justice League (2017)', 'Batman v Superman (2016)'],
    q3: ['Avengers (2012)', 'Avengers: Age of Ultron (2015)', 'Avengers: Infinity War (2018)', 'Avengers: Endgame (2019)'],
    q4: ['Captain America: Civil War (2016)', 'Avengers: Age of Ultron (2015)', 'Blank Panther (2016)', 'Avengers: Endgame (2019)'],
    q5: ['Avengers (2012)', 'Avengers: Age of Ultron (2015)', 'Avengers: Infinity War (2018)', 'Avengers: Endgame (2019)'],
    q6: ['Drive (2011)','Divergent (2014)','November Criminals (2017)','Baby Driver (2017)'],
    q7: ['Batman v Superman (2016)', 'Justice League (2017)', 'The Dark Knight Rises (2012)','The Dark Knight (2008)'],
    q8: ['Avengers (2012)', 'Avengers: Age of Ultron (2015)', 'Avengers: Infinity War (2018)', 'Avengers: Endgame (2019)'],
    q9: ['Drive (2011)', 'Crazy, Stupid, Love (2011)', 'The Place Beyond the Pines (2012)', 'Bladerunner 2049 (2017)'],
    q10: ['Deadpool (2016)', 'Deadpool 2 (2018)', 'Deadpool 3 (2019)', 'Avengers (2012)'],
  },
  answers: {
    q1: 'American Made (2017)',
    q2: 'Aquaman (2018)',
    q3: 'Avengers (2012)',
    q4: 'Blank Panther (2016)',
    q5: 'Avengers: Infinity War (2018)',
    q6: 'Baby Driver (2017)',
    q7: 'Batman v Superman (2016)',
    q8: 'Avengers: Age of Ultron (2015)',
    q9: 'Bladerunner 2049 (2017)',
    q10: 'Deadpool (2016)',
  },
  // trivia methods
  // method to initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();

    //hide Deadpool and his instructions
    $('#higuys').hide();
    $('#instructions').hide();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 20 seconds each question
    trivia.timer = 10;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets all the questions then indexes the current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').html(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // creates all the trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn">'+key+'</button>'));

    //hide Deadpool and his instructions
    $('#higuys').hide();
    $('#instructions').hide();

    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 3000);
      $('#results').html('<h3>Look who was dragging ass. The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +', you embarassment.</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Look you finished! I knew you could do it.</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Now press that button again. You know you want to.</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to evaluate the option clicked
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 3000);
      $('#results').html("<h3>CORRECT! Wow. You really surprised me there, buddy. Good job. I'm rooting for you.</h3>");
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 3000);
      $('#results').html("<h3>Wrong! You hear that often, don't you? The answer was " + currentAnswer +' cow.</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}