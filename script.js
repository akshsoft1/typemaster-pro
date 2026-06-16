/* ==========================================
   TYPEMASTER PRO
   PART 3A
   CORE TYPING ENGINE
========================================== */

/* ==========================================
   APP STATE
========================================== */

const app = {

    active:false,

    timer:null,

    duration:60,

    timeLeft:60,

    currentText:"",

    typedText:"",

    mistakes:0,

    correctChars:0,

    totalTyped:0,

    currentIndex:0,

    testStart:null,

    currentWPM:0,

    currentAccuracy:100

};

/* ==========================================
   DOM
========================================== */

const textDisplay =
document.getElementById("textDisplay");

const typingInput =
document.getElementById("typingInput");

const startBtn =
document.getElementById("startTestBtn");

const durationSelect =
document.getElementById("duration");

const difficultySelect =
document.getElementById("difficulty");

const categorySelect =
document.getElementById("category");

const timerDisplay =
document.getElementById("timerDisplay");

const liveWPM =
document.getElementById("liveWPM");

const liveAccuracy =
document.getElementById("liveAccuracy");

const liveMistakes =
document.getElementById("liveMistakes");

/* ==========================================
   TEXT DATABASE
========================================== */

const TEXTS = {

words:[
"apple orange mango keyboard monitor mobile gaming typing speed internet future technology coding javascript design neon cyber security cloud data science",
"river mountain sunset galaxy universe coding challenge mobile tablet desktop innovation progress system network browser"
],

sentences:[
"The quick brown fox jumps over the lazy dog.",
"Typing consistently every day improves both speed and accuracy.",
"Practice makes progress when focused effort is repeated regularly."
],

paragraphs:[
`Typing is an essential skill in the modern digital world. Faster typing allows people to communicate ideas more efficiently while reducing effort and increasing productivity.`,

`Consistent practice builds muscle memory. Over time, users learn key positions naturally and develop greater confidence while typing.`
],

quotes:[
"Success is the sum of small efforts repeated day in and day out.",
"Discipline is choosing what you want most over what you want now.",
"Dream big. Start small. Act now."
],

code:[
`function calculateScore(points){
 return points * 10;
}`,

`const user = {
 name:"TypeMaster",
 level:5
};`
],

numbers:[
"124 663 882 109 555 991 774 221 783 654 999",
"12345 67890 11111 22222 33333 44444 55555"
],

mixed:[
"A@7#B!3$C%8&D*2(K)",
"X9@q!4#P$7&z%1*L"
]

};

/* ==========================================
   DIFFICULTY FILTER
========================================== */

function getTextByDifficulty(){

    const difficulty =
    difficultySelect.value;

    const category =
    categorySelect.value;

    let pool =
    TEXTS[category] || TEXTS.words;

    if(difficulty === "beginner"){

        return pool[0];

    }

    if(difficulty === "intermediate"){

        return pool[
            Math.floor(
                Math.random() * pool.length
            )
        ];

    }

    if(difficulty === "advanced"){

        return pool.join(" ");

    }

    if(difficulty === "expert"){

        return pool.join(" ") +
        " " +
        pool.join(" ");

    }

    return pool[0];

}

/* ==========================================
   START TEST
========================================== */

function startTest(){

    clearInterval(app.timer);

    app.active = true;

    app.timeLeft =
    parseInt(durationSelect.value);

    app.duration =
    app.timeLeft;

    app.currentText =
    getTextByDifficulty();

    app.currentIndex = 0;

    app.mistakes = 0;

    app.correctChars = 0;

    app.totalTyped = 0;

    app.currentWPM = 0;

    app.currentAccuracy = 100;

    app.typedText = "";

    typingInput.value = "";

    typingInput.disabled = false;

    typingInput.focus();

    app.testStart =
    Date.now();

    timerDisplay.textContent =
    app.timeLeft;

    renderText();

    startTimer();

}

/* ==========================================
   TIMER
========================================== */

function startTimer(){

    app.timer =
    setInterval(()=>{

        app.timeLeft--;

        timerDisplay.textContent =
        app.timeLeft;

        if(app.timeLeft <= 0){

            finishTest();

        }

    },1000);

}

/* ==========================================
   RENDER TEXT
========================================== */

function renderText(){

    let html = "";

    for(
        let i=0;
        i<app.currentText.length;
        i++
    ){

        const char =
        app.currentText[i];

        let cls = "";

        if(i < app.typedText.length){

            if(
                app.typedText[i] === char
            ){

                cls = "correct";

            }else{

                cls = "incorrect";

            }

        }
        else if(
            i === app.typedText.length
        ){

            cls = "current";

        }

        html +=
        `<span class="${cls}">${char}</span>`;

    }

    textDisplay.innerHTML =
    html;

}

/* ==========================================
   INPUT
========================================== */

typingInput.addEventListener(
"input",
handleTyping
);

function handleTyping(){

    if(!app.active) return;

    app.typedText =
    typingInput.value;

    app.totalTyped =
    app.typedText.length;

    calculateStats();

    renderText();

}

/* ==========================================
   STATS
========================================== */

function calculateStats(){

    let correct = 0;

    let mistakes = 0;

    for(
        let i=0;
        i<app.typedText.length;
        i++
    ){

        if(
            app.typedText[i] ===
            app.currentText[i]
        ){

            correct++;

        }else{

            mistakes++;

        }

    }

    app.correctChars = correct;

    app.mistakes = mistakes;

    const elapsedMinutes =
    (app.duration -
    app.timeLeft) / 60;

    app.currentWPM =
    elapsedMinutes > 0
    ?
    Math.round(
        (correct / 5) /
        elapsedMinutes
    )
    : 0;

    app.currentAccuracy =
    app.totalTyped > 0
    ?
    Math.round(
        (correct /
        app.totalTyped) * 100
    )
    : 100;

    updateLiveStats();

}

/* ==========================================
   UPDATE UI
========================================== */

function updateLiveStats(){

    liveWPM.textContent =
    app.currentWPM;

    liveAccuracy.textContent =
    app.currentAccuracy + "%";

    liveMistakes.textContent =
    app.mistakes;

}

/* ==========================================
   FINISH TEST
========================================== */

function finishTest(){

    clearInterval(app.timer);

    app.active = false;

    typingInput.disabled = true;

    alert(
`Test Complete!

WPM: ${app.currentWPM}

Accuracy: ${app.currentAccuracy}%

Mistakes: ${app.mistakes}`
    );

}

/* ==========================================
   EVENTS
========================================== */

startBtn.addEventListener(
"click",
startTest
);

/* ==========================================
   INIT
========================================== */

typingInput.disabled = true;
timerDisplay.textContent = "60";
/* ==========================================
   PART 3B
   RESULTS + LOCAL STORAGE
========================================== */

/* ==========================================
   STORAGE KEYS
========================================== */

const STORAGE_KEY =
"typemaster_pro_data";

/* ==========================================
   DEFAULT DATA
========================================== */

const defaultData = {

    username:"Guest Player",

    level:1,

    xp:0,

    coins:0,

    streak:0,

    longestStreak:0,

    testsCompleted:0,

    bestWPM:0,

    bestAccuracy:0,

    totalWPM:0,

    averageWPM:0,

    totalPracticeTime:0,

    history:[],

    chartData:[]

};

/* ==========================================
   USER DATA
========================================== */

let userData =
loadData();

/* ==========================================
   LOAD
========================================== */

function loadData(){

    const saved =
    localStorage.getItem(
    STORAGE_KEY
    );

    if(saved){

        return JSON.parse(saved);

    }

    return {...defaultData};

}

/* ==========================================
   SAVE
========================================== */

function saveData(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userData)
    );

}

/* ==========================================
   PROFILE ELEMENTS
========================================== */

const bestWPMEl =
document.getElementById(
"bestWPM"
);

const avgWPMEl =
document.getElementById(
"avgWPM"
);

const bestAccuracyEl =
document.getElementById(
"bestAccuracy"
);

const testsCompletedEl =
document.getElementById(
"testsCompleted"
);

const coinCountEl =
document.getElementById(
"coinCount"
);

const xpCountEl =
document.getElementById(
"xpCount"
);

const streakCountEl =
document.getElementById(
"streakCount"
);

const levelValueEl =
document.getElementById(
"levelValue"
);

const currentXPEl =
document.getElementById(
"currentXP"
);

const nextLevelXPEl =
document.getElementById(
"nextLevelXP"
);

const xpFillEl =
document.getElementById(
"xpFill"
);

const usernameDisplayEl =
document.getElementById(
"usernameDisplay"
);

/* ==========================================
   DASHBOARD UPDATE
========================================== */

function updateDashboard(){

    bestWPMEl.textContent =
    userData.bestWPM;

    avgWPMEl.textContent =
    userData.averageWPM;

    bestAccuracyEl.textContent =
    userData.bestAccuracy + "%";

    testsCompletedEl.textContent =
    userData.testsCompleted;

    coinCountEl.textContent =
    userData.coins;

    xpCountEl.textContent =
    userData.xp;

    streakCountEl.textContent =
    userData.streak;

    levelValueEl.textContent =
    userData.level;

    usernameDisplayEl.textContent =
    userData.username;

    currentXPEl.textContent =
    userData.xp + " XP";

    const nextXP =
    userData.level * 100;

    nextLevelXPEl.textContent =
    nextXP + " XP";

    const progress =
    Math.min(
    (userData.xp / nextXP) * 100,
    100
    );

    xpFillEl.style.width =
    progress + "%";

}

/* ==========================================
   TEST RESULT SAVE
========================================== */

function saveTestResult(){

    userData.testsCompleted++;

    userData.totalPracticeTime +=
    app.duration;

    userData.totalWPM +=
    app.currentWPM;

    userData.averageWPM =
    Math.round(
    userData.totalWPM /
    userData.testsCompleted
    );

    if(
    app.currentWPM >
    userData.bestWPM
    ){

        userData.bestWPM =
        app.currentWPM;

    }

    if(
    app.currentAccuracy >
    userData.bestAccuracy
    ){

        userData.bestAccuracy =
        app.currentAccuracy;

    }

    userData.history.push({

        date:
        new Date()
        .toLocaleDateString(),

        wpm:
        app.currentWPM,

        accuracy:
        app.currentAccuracy,

        mistakes:
        app.mistakes

    });

    if(
    userData.history.length > 100
    ){

        userData.history.shift();

    }

    userData.chartData.push({

        date:
        new Date()
        .toLocaleDateString(),

        wpm:
        app.currentWPM,

        accuracy:
        app.currentAccuracy

    });

    if(
    userData.chartData.length > 30
    ){

        userData.chartData.shift();

    }

    saveData();

    updateDashboard();

}

/* ==========================================
   XP REWARD
========================================== */

function grantRewards(){

    const earnedXP =

    Math.floor(
        app.currentWPM
    ) +

    Math.floor(
        app.currentAccuracy / 2
    );

    const earnedCoins =

    Math.max(
        5,
        Math.floor(
            app.currentWPM / 2
        )
    );

    userData.xp +=
    earnedXP;

    userData.coins +=
    earnedCoins;

    checkLevelUp();

}

/* ==========================================
   LEVEL SYSTEM
========================================== */

function checkLevelUp(){

    let neededXP =
    userData.level * 100;

    while(
    userData.xp >= neededXP
    ){

        userData.level++;

        showLevelUp();

        neededXP =
        userData.level * 100;

    }

}

/* ==========================================
   LEVEL UP EFFECT
========================================== */

function showLevelUp(){

    const profile =
    document.querySelector(
    ".profile-card"
    );

    profile.classList.add(
    "level-up"
    );

    setTimeout(()=>{

        profile.classList.remove(
        "level-up"
        );

    },1000);

}

/* ==========================================
   RESULT MODAL
========================================== */

function showResults(){

    const msg =

`🏆 Test Complete

WPM: ${app.currentWPM}

Accuracy: ${app.currentAccuracy}%

Mistakes: ${app.mistakes}

Coins Earned:
${Math.max(5,
Math.floor(app.currentWPM/2)
)}

XP Earned:
${
Math.floor(app.currentWPM)+
Math.floor(app.currentAccuracy/2)
}`;

    alert(msg);

}

/* ==========================================
   OVERRIDE FINISH TEST
========================================== */

function finishTest(){

    clearInterval(
    app.timer
    );

    app.active = false;

    typingInput.disabled = true;

    grantRewards();

    saveTestResult();

    showResults();

}

/* ==========================================
   PRACTICE TIME
========================================== */

function getPracticeHours(){

    return (
    userData.totalPracticeTime
    / 3600
    ).toFixed(1);

}

/* ==========================================
   USERNAME SAVE
========================================== */

function setUsername(name){

    userData.username =
    name;

    saveData();

    updateDashboard();

}

/* ==========================================
   HISTORY
========================================== */

function getRecentHistory(){

    return userData.history
    .slice(-10)
    .reverse();

}

/* ==========================================
   PERSONAL BEST
========================================== */

function getPersonalBest(){

    return {

        bestWPM:
        userData.bestWPM,

        bestAccuracy:
        userData.bestAccuracy,

        tests:
        userData.testsCompleted

    };

}

/* ==========================================
   RESET DATA
========================================== */

function resetProgress(){

    if(
    confirm(
    "Reset all progress?"
    )
    ){

        localStorage.removeItem(
        STORAGE_KEY
        );

        location.reload();

    }

}

/* ==========================================
   INIT DASHBOARD
========================================== */

updateDashboard();
/* ==========================================
   PART 3C
   ACHIEVEMENTS + STREAKS + CHALLENGES
========================================== */

/* ==========================================
   ACHIEVEMENTS
========================================== */

const ACHIEVEMENTS = {

    first_test:{
        title:"First Test Completed",
        icon:"🎖️"
    },

    wpm_50:{
        title:"Reached 50 WPM",
        icon:"⚡"
    },

    wpm_100:{
        title:"Reached 100 WPM",
        icon:"🚀"
    },

    streak_7:{
        title:"7 Day Streak",
        icon:"🔥"
    },

    tests_100:{
        title:"100 Tests Completed",
        icon:"💯"
    }

};

/* ==========================================
   DEFAULT STORAGE EXTENSION
========================================== */

if(!userData.achievements){

    userData.achievements = [];

}

if(!userData.lastPracticeDate){

    userData.lastPracticeDate = null;

}

if(!userData.dailyChallenge){

    userData.dailyChallenge = {};

}

/* ==========================================
   ACHIEVEMENT POPUP
========================================== */

const achievementPopup =
document.getElementById(
"achievementPopup"
);

const achievementText =
document.getElementById(
"achievementText"
);

/* ==========================================
   SHOW POPUP
========================================== */

function showAchievement(title){

    achievementText.textContent =
    title;

    achievementPopup.classList.add(
    "show"
    );

    setTimeout(()=>{

        achievementPopup.classList.remove(
        "show"
        );

    },4000);

}

/* ==========================================
   UNLOCK
========================================== */

function unlockAchievement(id){

    if(
        userData.achievements.includes(id)
    ){
        return;
    }

    userData.achievements.push(id);

    saveData();

    const achievement =
    ACHIEVEMENTS[id];

    if(achievement){

        showAchievement(
        achievement.icon +
        " " +
        achievement.title
        );

    }

    renderAchievements();

}

/* ==========================================
   RENDER ACHIEVEMENTS
========================================== */

function renderAchievements(){

    const cards =
    document.querySelectorAll(
    ".achievement"
    );

    const ids = [

        "first_test",
        "wpm_50",
        "wpm_100",
        "streak_7",
        "tests_100"

    ];

    cards.forEach(
    (card,index)=>{

        const id = ids[index];

        if(
            userData.achievements.includes(id)
        ){

            card.classList.remove(
            "locked"
            );

            card.classList.add(
            "unlocked"
            );

        }

    });

}

/* ==========================================
   ACHIEVEMENT CHECKS
========================================== */

function checkAchievements(){

    if(
        userData.testsCompleted >= 1
    ){

        unlockAchievement(
        "first_test"
        );

    }

    if(
        app.currentWPM >= 50
    ){

        unlockAchievement(
        "wpm_50"
        );

    }

    if(
        app.currentWPM >= 100
    ){

        unlockAchievement(
        "wpm_100"
        );

    }

    if(
        userData.streak >= 7
    ){

        unlockAchievement(
        "streak_7"
        );

    }

    if(
        userData.testsCompleted >= 100
    ){

        unlockAchievement(
        "tests_100"
        );

    }

}

/* ==========================================
   STREAK SYSTEM
========================================== */

function updateStreak(){

    const today =
    new Date()
    .toDateString();

    const last =
    userData.lastPracticeDate;

    if(!last){

        userData.streak = 1;

    }
    else{

        const lastDate =
        new Date(last);

        const currentDate =
        new Date(today);

        const diffDays =
        Math.floor(
            (
                currentDate -
                lastDate
            ) /
            86400000
        );

        if(diffDays === 1){

            userData.streak++;

        }
        else if(diffDays > 1){

            userData.streak = 1;

        }

    }

    if(
        userData.streak >
        userData.longestStreak
    ){

        userData.longestStreak =
        userData.streak;

    }

    userData.lastPracticeDate =
    today;

}

/* ==========================================
   DAILY CHALLENGE
========================================== */

const challengeTitle =
document.getElementById(
"challengeTitle"
);

const challengeStatus =
document.getElementById(
"challengeStatus"
);

const challengeFill =
document.getElementById(
"challengeFill"
);

/* ==========================================
   GENERATE CHALLENGE
========================================== */

function generateDailyChallenge(){

    const today =
    new Date()
    .toDateString();

    if(
        userData.dailyChallenge.date ===
        today
    ){

        updateChallengeUI();

        return;

    }

    const targetWPM =

    Math.floor(
        30 +
        Math.random()*50
    );

    userData.dailyChallenge = {

        date:today,

        target:targetWPM,

        progress:0,

        completed:false

    };

    saveData();

    updateChallengeUI();

}

/* ==========================================
   UPDATE CHALLENGE
========================================== */

function updateChallengeUI(){

    const challenge =
    userData.dailyChallenge;

    challengeTitle.textContent =

    `Reach ${challenge.target} WPM`;

    challengeStatus.textContent =

    `${challenge.progress}
    / ${challenge.target}`;

    const percent =

    Math.min(
        (
            challenge.progress /
            challenge.target
        ) * 100,
        100
    );

    challengeFill.style.width =
    percent + "%";

}

/* ==========================================
   CHALLENGE CHECK
========================================== */

function checkChallenge(){

    const challenge =
    userData.dailyChallenge;

    if(
        challenge.completed
    ){

        return;

    }

    challenge.progress =
    Math.max(
        challenge.progress,
        app.currentWPM
    );

    if(
        app.currentWPM >=
        challenge.target
    ){

        challenge.completed = true;

        userData.xp += 100;

        userData.coins += 50;

        showAchievement(
        "🎯 Daily Challenge Complete"
        );

    }

    updateChallengeUI();

    saveData();

}

/* ==========================================
   XP FLOAT EFFECT
========================================== */

function createXPFloat(xp){

    const el =
    document.createElement("div");

    el.className =
    "xp-float";

    el.textContent =
    "+" + xp + " XP";

    el.style.left =
    (window.innerWidth/2) + "px";

    el.style.top =
    (window.innerHeight/2) + "px";

    document.body.appendChild(el);

    setTimeout(()=>{

        el.remove();

    },1800);

}

/* ==========================================
   OVERRIDE REWARD FUNCTION
========================================== */

const oldGrantRewards =
grantRewards;

grantRewards = function(){

    const earnedXP =

    Math.floor(
        app.currentWPM
    ) +

    Math.floor(
        app.currentAccuracy/2
    );

    const earnedCoins =

    Math.max(
        5,
        Math.floor(
            app.currentWPM/2
        )
    );

    userData.xp += earnedXP;

    userData.coins += earnedCoins;

    createXPFloat(
        earnedXP
    );

    checkLevelUp();

};

/* ==========================================
   OVERRIDE FINISH TEST
========================================== */

const oldFinishTest =
finishTest;

finishTest = function(){

    clearInterval(
    app.timer
    );

    app.active = false;

    typingInput.disabled = true;

    updateStreak();

    grantRewards();

    saveTestResult();

    checkAchievements();

    checkChallenge();

    showResults();

    saveData();

    updateDashboard();

};

/* ==========================================
   INITIALIZE
========================================== */

generateDailyChallenge();

renderAchievements();

updateChallengeUI();
/* ==========================================
   PART 3D
   FINAL CORE SYSTEMS
========================================== */

/* ==========================================
   THEME SYSTEM
========================================== */

const themePanel =
document.getElementById(
"themePanel"
);

const themeBtn =
document.getElementById(
"themeBtn"
);

const themeButtons =
themePanel.querySelectorAll(
"button"
);

const THEME_KEY =
"tm_theme";

function applyTheme(theme){

    document.body.classList.remove(
        "theme-purple",
        "theme-matrix",
        "theme-gold"
    );

    switch(theme){

        case "purple":
            document.body.classList.add(
            "theme-purple"
            );
            break;

        case "matrix":
            document.body.classList.add(
            "theme-matrix"
            );
            break;

        case "gold":
            document.body.classList.add(
            "theme-gold"
            );
            break;
    }

    localStorage.setItem(
    THEME_KEY,
    theme
    );

}

themeBtn?.addEventListener(
"click",
()=>{

    themePanel.classList.toggle(
    "active"
    );

});

themeButtons.forEach(btn=>{

    btn.addEventListener(
    "click",
    ()=>{

        const theme =
        btn.dataset.theme;

        applyTheme(theme);

    });

});

const savedTheme =
localStorage.getItem(
THEME_KEY
);

if(savedTheme){

    applyTheme(savedTheme);

}

/* ==========================================
   SOUND ENGINE
========================================== */

let soundEnabled = true;

const soundBtn =
document.getElementById(
"soundBtn"
);

const audioCtx =
window.AudioContext
?
new AudioContext()
:
null;

function beep(
frequency = 500,
duration = 100
){

    if(
    !soundEnabled ||
    !audioCtx
    ) return;

    const osc =
    audioCtx.createOscillator();

    const gain =
    audioCtx.createGain();

    osc.connect(gain);

    gain.connect(
    audioCtx.destination
    );

    osc.frequency.value =
    frequency;

    osc.type = "sine";

    gain.gain.value =
    0.03;

    osc.start();

    setTimeout(()=>{

        osc.stop();

    },duration);

}

function playKey(){

    beep(600,40);

}

function playError(){

    beep(180,100);

}

function playSuccess(){

    beep(900,150);

}

function playAchievement(){

    beep(1200,200);

}

function playLevelUp(){

    beep(1500,250);

}

soundBtn?.addEventListener(
"click",
()=>{

    soundEnabled =
    !soundEnabled;

    soundBtn.textContent =
    soundEnabled
    ?
    "🔊"
    :
    "🔇";

});

/* ==========================================
   KEY SOUND
========================================== */

typingInput.addEventListener(
"keydown",
(e)=>{

    if(!app.active)
    return;

    if(
    e.key.length === 1
    ){

        playKey();

    }

});

/* ==========================================
   PATCH ACHIEVEMENT
========================================== */

const originalAchievement =
showAchievement;

showAchievement =
function(title){

    playAchievement();

    originalAchievement(
    title
    );

};

/* ==========================================
   PATCH LEVELUP
========================================== */

const originalLevelUp =
showLevelUp;

showLevelUp =
function(){

    playLevelUp();

    originalLevelUp();

};

/* ==========================================
   PROFILE MANAGER
========================================== */

function setupProfile(){

    let name =
    prompt(
    "Enter Username",
    userData.username
    );

    if(
    !name ||
    !name.trim()
    ) return;

    name =
    name.trim();

    userData.username =
    name;

    saveData();

    updateDashboard();

}

usernameDisplayEl?.addEventListener(
"click",
setupProfile
);

/* ==========================================
   LEADERBOARD
========================================== */

function generateLeaderboard(){

    const list =
    document.getElementById(
    "leaderboardList"
    );

    if(!list) return;

    const fakeUsers = [

        {
            name:"CyberTyper",
            wpm:145
        },

        {
            name:"NeonMaster",
            wpm:138
        },

        {
            name:"SpeedKing",
            wpm:132
        },

        {
            name:"CodeNinja",
            wpm:125
        },

        {
            name:userData.username,
            wpm:userData.bestWPM
        }

    ];

    fakeUsers.sort(
    (a,b)=>
    b.wpm-a.wpm
    );

    list.innerHTML = "";

    fakeUsers.forEach(
    (player,index)=>{

        const row =
        document.createElement(
        "div"
        );

        row.className =
        "leader-row";

        row.innerHTML =

        `
        <span>
        #${index+1}
        ${player.name}
        </span>

        <span>
        ${player.wpm} WPM
        </span>
        `;

        list.appendChild(
        row
        );

    });

}

/* ==========================================
   CANVAS CHART
========================================== */

const chartCanvas =
document.getElementById(
"progressChart"
);

function drawChart(){

    if(
    !chartCanvas
    ) return;

    const ctx =
    chartCanvas.getContext(
    "2d"
    );

    chartCanvas.width =
    chartCanvas.offsetWidth;

    chartCanvas.height =
    300;

    const data =
    userData.chartData;

    ctx.clearRect(
    0,
    0,
    chartCanvas.width,
    chartCanvas.height
    );

    if(
    data.length < 2
    ) return;

    const maxWPM =
    Math.max(
    ...data.map(
    d=>d.wpm
    ),
    100
    );

    const padding = 40;

    ctx.beginPath();

    ctx.lineWidth = 3;

    ctx.strokeStyle =
    "#00c6ff";

    data.forEach(
    (point,index)=>{

        const x =

        padding +

        (
            index *
            (
                (
                chartCanvas.width -
                padding*2
                ) /
                (
                data.length-1
                )
            )
        );

        const y =

        chartCanvas.height -

        padding -

        (
            point.wpm /
            maxWPM
        ) *
        (
            chartCanvas.height -
            padding*2
        );

        if(index===0){

            ctx.moveTo(
            x,
            y
            );

        }else{

            ctx.lineTo(
            x,
            y
            );

        }

    });

    ctx.stroke();

}

/* ==========================================
   PATCH SAVE RESULT
========================================== */

const originalSaveResult =
saveTestResult;

saveTestResult =
function(){

    originalSaveResult();

    drawChart();

    generateLeaderboard();

};

/* ==========================================
   APP BOOTSTRAP
========================================== */

function initializeApp(){

    updateDashboard();

    renderAchievements();

    generateDailyChallenge();

    updateChallengeUI();

    drawChart();

    generateLeaderboard();

    typingInput.disabled =
    true;

}

/* ==========================================
   RESIZE CHART
========================================== */

window.addEventListener(
"resize",
drawChart
);

/* ==========================================
   AUTO SAVE
========================================== */

setInterval(()=>{

    saveData();

},30000);

/* ==========================================
   STARTUP
========================================== */

initializeApp();

/* ==========================================
   END OF PART 3D
========================================== */
/* ==========================================
   PWA REGISTER
========================================== */

if(
'serviceWorker' in navigator
){

    window.addEventListener(
    'load',
    ()=>{

        navigator.serviceWorker
        .register(
        './service-worker.js'
        )
        .then(()=>{

            console.log(
            "Service Worker Registered"
            );

        })
        .catch(error=>{

            console.error(
            error
            );

        });

    });

}
/* ==========================================
   INSTALL APP
========================================== */

let deferredPrompt;

const installBtn =
document.getElementById(
"installBtn"
);

window.addEventListener(
"beforeinstallprompt",
e=>{

    e.preventDefault();

    deferredPrompt = e;

    installBtn.style.display =
    "block";

});

installBtn?.addEventListener(
"click",
async ()=>{

    if(!deferredPrompt)
    return;

    deferredPrompt.prompt();

    const result =

    await deferredPrompt.userChoice;

    console.log(result);

    deferredPrompt = null;

    installBtn.style.display =
    "none";

});

   