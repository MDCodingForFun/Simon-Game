
// variables
let userSeqArr = [],
    simonSeqArr = [],
    id = "",
    color = "",
    level = 0,
    myError,
    myInterval,
    repeatInterval,
    boardSound = [
      "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //green
      "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //red
      "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //yellow
      "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3", //blue
    ],
    buzzer = "http://www.orangefreesounds.com/wp-content/uploads/2014/08/Wrong-answer-sound-effect.mp3";

const levelNum = 20;

// start simon sequence
$(document).ready(function(){

  // implement toggle switch
  $('.outer-switch').click(function(){
    $('.inner-switch').toggleClass('inner-switch-active');
    // console.log($('.inner-switch').attr('class').split(' ')[1])
    if($('.inner-switch').attr('class').split(' ')[1] == 'inner-switch-active'){

      $('.display').text('--');

      // start button listener
      $('#startBtn').click(function(){
        level++;
        simonSequence();
      });

      // implement strict mode
      $('#strictBtn').click(function(){
        $('.strict-led').toggleClass('strict-led-on');
        strictMode();
      }); 

       //user pad listener
      $('.pad').click(pushColors);
      
    }
    else{
      reset();
      $('.display').text('');
      $('.strict-led').removeClass('strict-led-on');
      $('.pad').off('click'); 
      $('#startBtn').off('click');
      $('#strictBtn').off('click');
    }

  });

});

// push color pad
function pushColors(){
  id = $(this).attr('id');
  color =$(this).attr('class').split(' ')[1];
  userSeqArr.push(id);
  // console.log({id, color});
  addClassSound(id, color);

  //check user sequence
  if(!checkUserSeq()){
    
    if(!strictMode()){ 
      displayError();  

      let counter = 0;
      repeatInterval =  setInterval(function(){
        counter++;
        if(counter = 5){
          repeatSimonSequence()
          clearInterval(repeatInterval);
        }
      }, 500);  
      
    }else{
      displayError();
      level = 0;
      simonSeqArr = [];
    }
    
  }
  // check end of sequence
  if(userSeqArr.length == simonSeqArr.length && userSeqArr.length < levelNum){
    userSeqArr = [];
    level++;
    simonSequence();
  }
  // check for winner
  if(userSeqArr.length == levelNum){
    $('.display').text("WIN");
  }

};

// check user sequence against Simon's
function checkUserSeq(){
  for( let i = 0; i < userSeqArr.length; i++){
    if(userSeqArr[i] != simonSeqArr[i]){
      return false;
    }
  }
  return true;
};

// display error
function displayError(){
  
  $('.display').text("!!");
  errorSound()
  
  let counter = 0;

  myError = setInterval(function(){
    counter++;
    if(counter == 3){
      $('.display').text(level);
      clearInterval(myError);
      userSeqArr = [];
      counter = 0;
    }   
  }, 500)

};
// Repeat Simon Sequence
function repeatSimonSequence(){
  
  $('.display').text(level);

  let i = 0;
  myInterval = setInterval(function(){
    id = simonSeqArr[i];
    color = $('#' + id).attr('class').split(' ')[1];
    // console.log({id, color});
    addClassSound(id, color);
    i++;
    if(i == simonSeqArr.length){
      clearInterval(myInterval);
    }
  }, 1200);

}
// Simon sequence
function simonSequence(){

  $('.display').text(level);
  generateRandomNum();

  let i = 0;

  myInterval = setInterval(function(){
    id = simonSeqArr[i];
    color = $('#' + id).attr('class').split(' ')[1];
    // console.log({id, color});
    addClassSound(id, color);
    i++;
    if(i == simonSeqArr.length){
      clearInterval(myInterval);
    }
  }, 1200);

};

// generate random number
function generateRandomNum(){
  let random = Math.floor(Math.random() * 4);
  simonSeqArr.push(random);
};

// add temporary class and sound
function addClassSound(id, color){
  $('#'+id).addClass(color+"-active");
  playSound(id);
  setTimeout (function(){
    $('#'+id).removeClass(color+"-active");
  }, 750);
};

// play sound
function playSound(id){
  let sound = new Audio(boardSound[id]);
  sound.play();
};

// strict mode
function strictMode(){

   if($('.strict-led').attr('class').split(' ')[1] == 'strict-led-on' ){
     return true;
   }else{
     return false;
   }

};

// play error sound
function errorSound(){
  let error = new Audio(buzzer);
  error.play();
}

// reset
function reset(){
  userSeqArr = [];
  simonSeqArr = [];
  level = 0;
  clearInterval(myInterval);
  clearInterval(myError);
  clearInterval(repeatInterval);
};
