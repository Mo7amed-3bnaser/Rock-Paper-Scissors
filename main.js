const gameContainer = document.querySelector(".container"),
userResult = document.querySelector(".user_result img"),
cpuResult = document.querySelector(".cpu_result img"),
result = document.querySelector(".result"),
optionImages = document.querySelectorAll(".option_image"),
resetBtn = document.querySelector(".reset-btn"),
userScoreElement = document.getElementById("user-score"),
cpuScoreElement = document.getElementById("cpu-score"),
finalResultScreen = document.querySelector(".final-result-screen"),
finalResultMessage = document.querySelector(".final-result-message"),
finalUserScore = document.querySelector(".final-user-score"),
finalCpuScore = document.querySelector(".final-cpu-score"),
playAgainBtn = document.querySelector(".play-again-btn");

// نظام النقاط
let userScore = 0;
let cpuScore = 0;
const SCORE_LIMIT = 5; // الحد الأقصى للنقاط

// تأثيرات صوتية
const playSound = (outcome) => {
    const audio = new Audio();
    if (outcome === "User") {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3";
    } else if (outcome === "Cpu") {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-losing-bleeps-2026.mp3";
    } else {
        audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-neutral-game-notification-253.mp3";
    }
    audio.play().catch(e => console.log("Audio play failed:", e));
};

// تأثيرات الحركة
const animateResult = (outcome) => {
    result.style.transform = "scale(1.2)";
    setTimeout(() => {
        result.style.transform = "scale(1)";
    }, 300);
    
    if (outcome === "User") {
        result.style.color = "#27ae60";
        result.style.background = "rgba(39, 174, 96, 0.2)";
    } else if (outcome === "Cpu") {
        result.style.color = "#e74c3c";
        result.style.background = "rgba(231, 76, 60, 0.2)";
    } else {
        result.style.color = "#f39c12";
        result.style.background = "rgba(243, 156, 18, 0.2)";
    }
};

// إظهار شاشة النتيجة النهائية
const showFinalResult = (winner) => {
    finalUserScore.textContent = userScore;
    finalCpuScore.textContent = cpuScore;
    
    if (winner === "User") {
        finalResultMessage.textContent = "لقد فزت! 🎉";
        finalResultMessage.className = "final-result-message win";
        playSound("User");
    } else {
        finalResultMessage.textContent = "لقد خسرت! 😢";
        finalResultMessage.className = "final-result-message lose";
        playSound("Cpu");
    }
    
    // إظهار الشاشة بعد تأخير قصير
    setTimeout(() => {
        finalResultScreen.classList.add("show");
    }, 1000);
};

// إعادة ضبط اللعبة
const resetGame = () => {
    userScore = 0;
    cpuScore = 0;
    userScoreElement.textContent = "0";
    cpuScoreElement.textContent = "0";
    userResult.src = cpuResult.src = "images/rock.png";
    result.textContent = "يلا نلعب!!";
    result.style.color = "#2c3e50";
    result.style.background = "rgba(142, 68, 173, 0.1)";
    
    optionImages.forEach(image => {
        image.classList.remove("active");
    });
    
    finalResultScreen.classList.remove("show");
};

// أزرار إعادة اللعبة
resetBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);

// منطق اللعبة
optionImages.forEach((image, index) => {
    image.addEventListener("click", (e) => {
        // تجاهل النقرات إذا كانت اللعبة منتهية
        if (userScore >= SCORE_LIMIT || cpuScore >= SCORE_LIMIT) return;
        
        image.classList.add("active");

        userResult.src = cpuResult.src = "images/rock.png";
        result.textContent = "جاري اللعب...";

        optionImages.forEach((image2, index2) => {
            index !== index2 && image2.classList.remove("active");
        });
        
        // تأخير لإظهار النتيجة (يعطي شعور بالتفاعل)
        setTimeout(() => {
            let imageSrc = e.target.querySelector("img").src;
            userResult.src = imageSrc;

            let randomNumber = Math.floor(Math.random() * 3);
            let cpuImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
            cpuResult.src = cpuImages[randomNumber];

            let cpuValue = ["R", "P", "S"][randomNumber];
            let userValue = ["R", "P", "S"][index];

            let outcomes = {
                RR: "Draw",
                RP: "Cpu",
                RS: "User",
                PP: "Draw",
                PR: "User",
                PS: "Cpu",
                SS: "Draw",
                SR: "Cpu",
                SP: "User",
            };
            
            let outComeValue = outcomes[userValue + cpuValue];
            
            // تحديث النتيجة والنقاط
            if (outComeValue === "User") {
                userScore++;
                userScoreElement.textContent = userScore;
                result.textContent = "أنت فزت! 🎉";
            } else if (outComeValue === "Cpu") {
                cpuScore++;
                cpuScoreElement.textContent = cpuScore;
                result.textContent = "الكمبيوتر فاز! 😢";
            } else {
                result.textContent = "تعادل! 🤝";
            }
            
            // تشغيل الصوت والحركة
            playSound(outComeValue);
            animateResult(outComeValue);
            
            // تأثيرات حركية للصور
            userResult.style.transform = "rotate(90deg) scale(1.2)";
            cpuResult.style.transform = "rotate(-90deg) rotateY(180deg) scale(1.2)";
            
            setTimeout(() => {
                userResult.style.transform = "rotate(90deg) scale(1)";
                cpuResult.style.transform = "rotate(-90deg) rotateY(180deg) scale(1)";
            }, 300);
            
            // التحقق من انتهاء اللعبة
            if (userScore >= SCORE_LIMIT) {
                showFinalResult("User");
            } else if (cpuScore >= SCORE_LIMIT) {
                showFinalResult("Cpu");
            }
            
        }, 500);
    });
});