const quizSteps = document.querySelectorAll('.quiz');
const progressBar = document.querySelector('.quiz__progress-bar div');
const processingDataBar = document.querySelector('.proccessing-data div');
const invalidMessage = document.querySelector('.invalid-message');
const quizResult = document.querySelector('.quiz-finish');
const callButton = document.querySelector('.call-button');
let activeStepIndex = 0;

// Current year insertation

const currentYear = new Date().getFullYear();
document.querySelectorAll('.current-year').forEach(function(el) {
    el.textContent = currentYear;
});

// Current year insertation


// Markup render for a select tag (year selection)

const minYear = 1920;
const maxYear = 2014;
const yearSelect = document.querySelector('#year');

for(let i = minYear; i < maxYear; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', i);
    option.textContent = i;
    yearSelect.append(option);
}

// Markup render for a select tag (year selection)

function zodiacSign(day, month) {
    let sign;

    switch (month) {
        case 1:
            if (day <= 19)
                sign = 'Capricorn';
            else
                sign = 'Aquarius';
            break;
        case 2:
            if (day <= 18)
                sign = 'Aquarius';
            else
                sign = 'Pisces';
            break;
        case 3:
            if (day <= 20)
                sign = 'Pisces';
            else
                sign = 'Aries';
            break;
        case 4:
            if (day <= 19)
                sign = 'Aries';
            else
                sign = 'Taurus';
            break;
        case 5:
            if (day <= 20)
                sign = 'Taurus';
            else
                sign = 'Gemini';
            break;
        case 6:
            if (day <= 21)
                sign = 'Gemini';
            else
                sign = 'Cancer';
            break;
        case 7:
            if (day <= 22)
                sign = 'Рак';
            else
                sign = 'Leo';
            break;
        case 8:
            if (day <= 22)
                sign = 'Leo';
            else
                sign = 'Virgo';
            break;
        case 9:
            if (day <= 22)
                sign = 'Virgo';
            else
                sign = 'Libra';
            break;
        case 10:
            if (day <= 22)
                sign = 'Libra';
            else
                sign = 'Scorpio';
            break;
        case 11:
            if (day <= 22)
                sign = 'Scorpio';
            else
                sign = 'Sagittarius';
            break;
        case 12:
            if (day <= 21)
                sign = 'Sagittarius';
            else
                sign = 'Capricorn';
            break;
    }

    return sign;
}

function scroll(element) {
    let bodyRect = document.body.getBoundingClientRect(),
    elemRect = element.getBoundingClientRect(),
    offset   = elemRect.top - bodyRect.top;

    window.scrollTo({
        top: offset,
        behavior: "smooth"
    });
}

function nextStep() {
    if(activeStepIndex === 0) document.querySelector('.pre-quiz').style.display = "none";

    if(activeStepIndex === quizSteps.length - 1) {
        progressBar.parentElement.style.display = 'none';

        let width = 1;
        let currentProcessStep = 0;
        const processSteps = document.querySelectorAll('.process-step');

        quizResult.style.display = 'block';

        function barHandler() {
            if (width > 100) {
                clearInterval(barId);
                document.querySelector('.recording').children[0].textContent = 'Готово!';
                setTimeout(function() {
                    quizResult.style.display = 'none';
                    document.querySelector('.call').style.display = 'block';
                }, 1500);
            }

            processingDataBar.parentElement.children[0].textContent = Math.round(width) + '%';
            processingDataBar.style.width = width + '%';

            width += 0.2;
        }

        function processStepsHandler() {
            if (currentProcessStep === processSteps.length - 1) {
                clearInterval(proccesId);
            }

            processSteps[currentProcessStep++].querySelector('span').textContent = 'Выполнено!';
        }

        const barId = setInterval(barHandler, 10);
        const proccesId = setInterval(processStepsHandler, 500);
    } 
        quizSteps[activeStepIndex].removeEventListener('change', showSubmitButton);
        activeStepIndex === quizSteps.length - 1
                            ? ++activeStepIndex
                            : quizSteps[++activeStepIndex].addEventListener('change', showSubmitButton)

        quizSteps.forEach(function(el, index) {
            if(index === activeStepIndex) {
                el.classList.add('active')
            } else {
                console.log('removed')
                el.classList.remove('active');
            }
        });
        if(activeStepIndex && activeStepIndex < quizSteps.length) {
            progressBar.parentElement.style.display = 'block';
            progressBar.style.width = (((activeStepIndex + 1) / quizSteps.length) * 100) + '%';
        }

}

function showSubmitButton() {
    const btn = quizSteps[activeStepIndex].querySelector('.quiz__submit');
    btn.style.display = "block";
    btn.addEventListener('click', nextStep);
    scroll(btn);

    if(activeStepIndex === 5) {
        const values = quizSteps[activeStepIndex].querySelectorAll('select');
        quizSteps[activeStepIndex].addEventListener('click', function({ target }) {
            if(target.tagName === 'SELECT') {
                for(let i = 0; i < values.length; i++) {
                    if (!(+values[i].value)) {
                        invalidMessage.style.display = 'block';
                        return;
                    }
                }
                invalidMessage.style.display = 'none';
                const zodiac = zodiacSign(+values[0].value, +values[1].value);
                document.querySelector('.zodiac').style.display = 'flex';
                document.querySelector('.zodiac img').setAttribute('src', `images/${zodiac}.png`)
                document.querySelector('.zodiac span').textContent = zodiac;
            }
        });
    }
}

quizSteps[activeStepIndex].addEventListener('change', showSubmitButton);

function renderResponse(data) {
    const table = document.createElement('table');

    for(const key in data) {
        const row = document.createElement('tr');
        const c1 = document.createElement('td');
        const c2 = document.createElement('td');

        c1.textContent = key;
        c2.textContent = data[key];

        row.append(c1, c2);
        table.append(row);
    }

    document.querySelector('.call').append(table);
}

callButton.addEventListener('click', function() {    
    fetch('https://swapi.dev/api/people/1/')
        .then(data => data.json())
        .then(res => {
            renderResponse(res);
        });
});