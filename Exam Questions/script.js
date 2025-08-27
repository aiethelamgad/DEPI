// Questions with choices and correct answer
const questions = [
    {
        question: "What is JavaScript?",
        options: ["A database", "A programming language", "A web server", "An operating system"],
        answer: "A programming language"
    },
    {
        question: "Which keyword declares a block-scoped variable?",
        options: ["var", "let", "const", "both let and const"],
        answer: "both let and const"
    },
    {
        question: "What is a callback function?",
        options: ["A function passed into another function", "A built-in loop", "A variable", "A data type"],
        answer: "A function passed into another function"
    },
    {
        question: "Which symbol is used for strict equality?",
        options: ["=", "==", "===", "!="],
        answer: "==="
    },
    {
        question: "What is the purpose of async/await?",
        options: ["To pause CSS animations", "To handle asynchronous code", "To declare variables", "To create loops"],
        answer: "To handle asynchronous code"
    },
    {
        question: "Difference between var, let, and const?",
        options: [
            "All are exactly the same",
            "var is function-scoped, let/const are block-scoped; const cannot be reassigned",
            "var and let are block-scoped, const is global",
            "const and var can be reassigned, let cannot"
        ],
        answer: "var is function-scoped, let/const are block-scoped; const cannot be reassigned"
    },
    {
        question: "Explain event bubbling.",
        options: [
            "The process where an event starts at the root and goes down to the element",
            "The process where an event starts at the target element and bubbles up to parents",
            "It is a method to prevent default actions",
            "It is a function that repeats events"
        ],
        answer: "The process where an event starts at the target element and bubbles up to parents"
    },
    {
        question: "What is a Promise in JS?",
        options: [
            "An object representing the eventual completion or failure of an async operation",
            "A type of loop",
            "A function scope",
            "A variable type"
        ],
        answer: "An object representing the eventual completion or failure of an async operation"
    },
    {
        question: "What are arrow functions?",
        options: [
            "Functions declared with => syntax, shorter and without their own 'this'",
            "Functions with arrows in their name",
            "Functions only used for arrays",
            "Functions that run asynchronously"
        ],
        answer: "Functions declared with => syntax, shorter and without their own 'this'"
    },
    {
        question: "What is hoisting?",
        options: [
            "Moving all variables and function declarations to the top of their scope",
            "Deleting variables from memory",
            "Declaring variables at the bottom of code",
            "Blocking variable reassignment"
        ],
        answer: "Moving all variables and function declarations to the top of their scope"
    },
    {
        question: "Explain closures.",
        options: [
            "A closure is a function bundled together with its lexical environment",
            "A way to close the browser window",
            "A method for hiding HTML elements",
            "A built-in JS loop"
        ],
        answer: "A closure is a function bundled together with its lexical environment"
    }
];

let availableQuestions = [...questions];
let currentQuestion = null;
let score = 0;

const questionBox = document.getElementById("questionBox");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

// Show random question
function showQuestion() {
    if (availableQuestions.length === 0) {
        endExam();
        return;
    }
    const index = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[index];
    availableQuestions.splice(index, 1);

    // Display question
    questionBox.innerHTML = currentQuestion.question;

    // Display options
    optionsBox.innerHTML = "";
    currentQuestion.options.forEach(option => {
        const li = document.createElement("li");
        li.innerHTML = `<label>
                          <input type="radio" name="answer" value="${option}"> ${option}
                        </label>`;
        optionsBox.appendChild(li);
    });
}

// Handle next question
nextBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert("Please select an answer!");
        return;
    }
    if (selected.value === currentQuestion.answer) {
        score++;
    }
    showQuestion();
});

// End exam
function endExam() {
    questionBox.innerHTML = `<b>Exam Finished! 🎉</b><br>Your Score: ${score} / ${questions.length}`;
    optionsBox.innerHTML = "";
    nextBtn.disabled = true;
    clearInterval(timer);
}

// Timer
let timeLeft = 5 * 60; // 5 minutes
const timerElement = document.getElementById("timer");

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent =
        `Time Left: ${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (timeLeft <= 0) {
        endExam();
    }
    timeLeft--;
}
const timer = setInterval(updateTimer, 1000);

// Start first question
showQuestion();