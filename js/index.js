// ********** Game Object, Stores all games data/properties ********** //
var simon = {
    userSeq: [],
    gameSeq: [],
    power: false,
    running: false,
    id: 0,
    color: 0,
    level: 0,
    rounds: 5,
    error: false,
    colorSound: [
        "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",    // Green
        "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",    // Yellow
        "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",    // Blue
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"     // Red
    ],
    errorSound: "http://www.freesound.org/data/previews/331/331912_3248244-lq.mp3",
    colorPower: {
        on: "#65db3b",
        off: "#db3b3b",
        inactive: "#6d7c93"
    }
};

// Starts a new game, resets all game variables
function newGame() {
    simon.running = true;
    simon.error = false;
    simon.level = 0;
    simon.level++;
    simon.gameSeq = [];
    simon.userSeq = [];
    $("#score-current").text(simon.level - 1);
    $("#score-rounds").text(simon.rounds);
    $("#start-stop").html("Stop");
    $(".section-game-win").hide();
    $(".section-game-score").show();
    setTimeout(simonSequence, 500);
    console.log("Game Started");
}

// finishes the current game, resets all game variables
function endGame () {
    simon.running = false;
    simon.error = false;
    simon.level = 0;
    simon.gameSeq = [];
    simon.userSeq = [];
    $("#start-stop").html("Start");
    $(".section-game-score").hide();
    console.log("Game Ended");
}

// launced when the user wins the game
function winGame() {
    $(".secton-game-score").hide();
    $(".section-game-win").show();
    $("#start-stop").html("Start");
}

// Code generated game sequences
function simonSequence() {
    console.log("Round " + simon.level + " of " + simon.rounds);
    if(!simon.error) {
        getRandomNum();
    }
    var i = 0;
    var myInterval = setInterval(function() {
        simon.id = simon.gameSeq[i];
        simon.color = $("#"+simon.id).attr("class");
        simon.color = simon.color.split(" ")[1];
        console.log("Game Sequence: " + simon.id + " " + simon.color);
        addClassSound(simon.id, simon.color);
        i++;
        if(i == simon.gameSeq.length) {
            clearInterval(myInterval);
        }
    }, 800);
}

// Function is launced when the user attempts to click a game button, or input a sequence
function userSequence() {
    simon.userSeq.push(simon.id);
    console.log("User clicked: " + simon.id + " " +simon.color);
    addClassSound(simon.id, simon.color);
    //check user sequence
    if(!checkUserSeq()) {
        simon.error = true;
        displayError();
        simon.userSeq = [];
        setTimeout(simonSequence, 500);
    }
    else {
        // Checks that the sequences has ended
        if(simon.userSeq.length == simon.gameSeq.length && simon.userSeq.length < simon.rounds) {
            simon.level++;
            $("#score-current").text(simon.level - 1);
            simon.userSeq = [];
            simon.error = false;
            console.log("Next round");
            simonSequence();
        }
    }
    //checking for winners
    if(simon.userSeq.length == simon.rounds) {
        console.log("You've Won!!");
        endGame();
        winGame();
    }
}

//generate random number
function getRandomNum() {
    var random = Math.floor(Math.random() * 4);
    simon.gameSeq.push(random);
}

/* checking user seq against simon's */
function checkUserSeq() {
    for(var i = 0; i < simon.userSeq.length; i++) {
        if(simon.userSeq[i] != simon.gameSeq[i]) {
            return false;
        }
    }
    return true;
}

// Excuted when an incoorect sequence has been inputted by the user.
function displayError() {
    console.log("Incorrect Sequence");
    var sound = new Audio(simon.errorSound);
    sound.play();
}

/* Plays the corresponding sound for the game buttons */
function playSound(id) {
    var sound = new Audio(simon.colorSound[simon.id]);
    sound.play();
}

/* add temporary class and sound  */
function addClassSound(id, color) {
    $("#"+id).addClass(color+"-game");
    playSound(id);
    setTimeout(function(){
    $("#"+id).removeClass(color+"-game");
    }, 500);
}

// Sets user's prefernces
function setSettings() {
    // Get rounds preferences
    var getTurns = $("#rounds-select").val();
    if (simon.rounds != getTurns) {
        simon.rounds = getTurns;
        console.log("Rounds changed to: " + simon.rounds);
    }
}

// Brings the settings menu up, function launced when game settings buttons are clicked.
function showSettings() {
    $(".section-power").hide();
    $(".section-off").hide();
    $(".section-game").hide();
    $(".section-set").show();
    $(".section-set-main").show();
    console.log("Settings Opened");
}

// Hides the settings menu, function launced when user navigates away from menu.
function hideSettings() {
    $(".section-set").hide();
    $(".section-set-main").hide();
    $(".section-set-con").hide();
    $(".section-power").show();
    if (simon.power == true) {
        $(".section-game").show();
    }
    else {
        $(".section-off").show();
    }
    console.log("Settings Closed");
}

function showConfirmation() {
    $(".section-set-main").hide();
    $(".section-set-con").show();
}


// ********** Click Events ********** //
$("#power-off").on({
    click: function() {
        if(simon.power == true) {
            simon.power = false;
            endGame();
            $("#power-on").css("background-color", simon.colorPower.inactive);
            $(this).css("background-color", simon.colorPower.off);
            $(".section-game-win").hide();
            $(".section-game").hide();
            $(".section-off").show();
            console.log("Power Switched Off");
        }
    },
    mouseenter: function() {
        $(this).css("background-color", simon.colorPower.off);
        $(this).css("opacity", "0.5");
    },
    mouseleave: function() {
        if(simon.power == false) {
            $(this).css("background-color", simon.colorPower.off);
        }
        else {
            $(this).css("background-color", simon.colorPower.inactive);
        }
        $(this).css("opacity", "1");
    }
});

$("#power-on").on({
    click: function() {
        if(simon.power == false) {
            $("#power-off").css("background-color", simon.colorPower.inactive);
            $(this).css("background-color", simon.colorPower.on);
            $(".section-off").hide();
            $(".section-set").hide();
            $(".section-game").show();
            $("#start-stop").html("Start");
            simon.power = true;
            console.log("Power Switched On");
        }
    },
    mouseenter: function() {
        $(this).css("background-color", simon.colorPower.on);
        $(this).css("opacity", "0.5");
    },
    mouseleave: function() {
        if(simon.power == true) {
            $(this).css("background-color", simon.colorPower.on);
        }
        else {
            $(this).css("background-color", simon.colorPower.inactive);
        }
        $(this).css("opacity", "1");
    }
});

$("#start-stop").click(function() {
    if (simon.running == false) {
        newGame();
    }
    else {
        endGame();
    }
});

$(".settings").click(function() {
    showSettings();
});

$(".pad").click(function() {
    simon.id = $(this).attr("id");
    simon.color = $(this).attr("class").split(" ")[1];
    userSequence();
});

$("#okSet").click(function() {
    if(($("#rounds-select").val()) != (simon.rounds)) {
        $(".section-set-main").hide();
        $(".section-set-con").show();
        console.log("Confirmation Screen Opened");
    }
    else {
        hideSettings();
    }
});

$("#canSet").click(function() {
    hideSettings();
});

$("#okCon").click(function() {
    setSettings();
    hideSettings();
    endGame();
});

$("#canCon").click(function() {
    $(".section-set-con").hide();
    $(".section-set-main").show();
    console.log("Confirmation Screen Closed");
});

$(document).ready(function(){
    $("#power-on").css("background-color", simon.colorPower.inactive);
    $("#power-off").css("background-color", simon.colorPower.off);
    $(".section-off").show();
    $(".section-power").show();
});
