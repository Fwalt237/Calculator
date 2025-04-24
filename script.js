function add(a,b){
    return a+b;
}
function subtract(a,b){
    return a-b;
}
function multiply(a,b){
    return a*b;
}
function divide(a,b){
    c= a/b;
    return c;
}

const numberButtons = document.querySelectorAll('#alphaNum .num');
const resultDisplay = document.querySelector('#output .result');
const allButtons = document.querySelectorAll('.button');

const clearButton = document.querySelector('#alphaNum .line.first .button:first-child');
const backspaceButton = document.querySelector('#alphaNum .line.first .button:nth-child(2)');
const plusMinusButton = document.querySelector('#alphaNum .plusMinus');
const percentageButton = document.querySelector('#alphaNum .line.first .button:nth-child(3)');
const operationButtons = document.querySelectorAll('#alphaNum .sign');
const equalsButton = document.querySelector('#alphaNum .equal');

let currentInput = '0';
let overwriteDisplay = true;
const MAX_DISPLAY_LENGTH = 9;
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function animateButton(button){
    button.classList.add('clicked');
    setTimeout(()=>{
        button.classList.remove('clicked');
    },100);
}

function formatNumberWithCommas(stringNumber){
    const parts = stringNumber.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] ? '.' + parts[1] : '';
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,',');
    return formattedInteger + decimalPart;
}

function stringToNumber(stringNumber){
    if(stringNumber.startsWith('-')){
        stringNumber = stringNumber.slice(1);
        let number = Number(stringNumber);
        return -1*number;
    }else{
        let number = Number(stringNumber);
        return number;
    }
}

function updateResultDisplay(){
    resultDisplay.textContent = formatNumberWithCommas(currentInput);
}
updateResultDisplay();

numberButtons.forEach(button => {button.addEventListener('click', ()=>{
    const clickedNumber = button.textContent.trim();
    const digitCount = currentInput.replace('.','').length;

    if(overwriteDisplay){
        if(/^[0-9]$/.test(clickedNumber)){
            currentInput = clickedNumber;
            overwriteDisplay = false;
        }else if(clickedNumber == '0'){
            currentInput = '0';
            overwriteDisplay = false;
        }else if(clickedNumber =='.'){
            currentInput='0.';
            overwriteDisplay = false;
        }
    }else if (clickedNumber ==='.'){
        if(!currentInput.includes('.')){
            currentInput +=clickedNumber;
        }
    }else if (digitCount >= MAX_DISPLAY_LENGTH && clickedNumber !== '.') {
        return; // Ignore input if max length reached and not a decimal
    }else{
        currentInput+=clickedNumber;
    }
    updateResultDisplay(); 
    animateButton(button);
    document.getElementById('container').focus();
});});

allButtons.forEach(button =>{
    button.addEventListener('click',()=>{
        animateButton(button);
        document.getElementById('container').focus();
    });
});

operationButtons.forEach(button =>{
    button.addEventListener('click', ()=>{
        const selectedOperator = button.textContent.trim();
        if(currentInput!=='0'){
            if(firstOperand === null){
                firstOperand = stringToNumber(currentInput);
            } else if(operator && waitingForSecondOperand){
                operator = selectedOperator; //change only the operator
                overwriteDisplay = true;
                waitingForSecondOperand = true;
            }
             else if (operator) {
                calculate();
                operator = selectedOperator;
                overwriteDisplay = true;
                waitingForSecondOperand = true;
            }
           
                operator = selectedOperator;
                overwriteDisplay = true;
                waitingForSecondOperand = true;
            
            
        } else if(selectedOperator==='-' && firstOperand===null && operator===null){
            currentInput='-';
            overwriteDisplay = false;
        }
        animateButton(button);
        document.getElementById('container').focus();
    });
});

equalsButton.addEventListener('click', ()=>{
    calculate();
    animateButton(equalsButton);
    document.getElementById('container').focus();
});

function calculate(){
    if(firstOperand!==null && operator && waitingForSecondOperand){
        const secondOperand = stringToNumber(currentInput);
        let result = null;
        switch(operator){
            case '+':
                result = add(firstOperand,secondOperand);
                break;
            case '-':
                result = subtract(firstOperand, secondOperand);
                break;
            case 'x':
                result = multiply(firstOperand, secondOperand);
                break;
            case '÷':
                if(secondOperand === 0){
                    currentInput = 'Error';
                    updateResultDisplay();
                    firstOperand = null;
                    operator = null;
                    waitingForSecondOperand = false;
                    overwriteDisplay = true; 
                    return;
                }
                result=divide(firstOperand,secondOperand);
                break;
        }
        currentInput = result.toString();
        const len = currentInput.replace('.', '').replace('-', '').length;
        if (len > 15){
            const exponentialForm = parseFloat(currentInput).toExponential(8);
            const parts = exponentialForm.split('e');
            let decimalPart = parts[0];
            const exponentPart = 'e' + parts[1];

            if (decimalPart.length > MAX_DISPLAY_LENGTH) {
                decimalPart = decimalPart.slice(0, 3);
            }
            currentInput = decimalPart + exponentPart;
        } else if(len >= MAX_DISPLAY_LENGTH){
            currentInput = currentInput.slice(0,MAX_DISPLAY_LENGTH+1);
        }
        updateResultDisplay();
        firstOperand = result;
        operator = null;
        waitingForSecondOperand = false;
        overwriteDisplay =true;
    } 
}

clearButton.addEventListener('click', ()=>{
    currentInput='0';
    firstOperand = null;
    overwriteDisplay = true;
    updateResultDisplay();
    document.getElementById('container').focus();
});

backspaceButton.addEventListener('click', ()=>{
    if(currentInput.length>1){
        currentInput=currentInput.slice(0,-1);
    } else{
        currentInput = '0';
        overwriteDisplay = true;
    }
    updateResultDisplay();
    document.getElementById('container').focus();
});

plusMinusButton.addEventListener('click', ()=>{
    if(currentInput!=='0'){
        if(currentInput.startsWith('-')){
            currentInput=currentInput.slice(1);
        }else {
            currentInput= '-' + currentInput;
        }
    }else if (currentInput==='0' && firstOperand===null && operator===null){
        currentInput='0';
        overwriteDisplay = false;
    } else if (firstOperand !== null && waitingForSecondOperand === true) {
        currentInput = (stringToNumber(currentInput) * -1).toString();
      }
    updateResultDisplay();
    document.getElementById('container').focus();
});

percentageButton.addEventListener('click', () => {
    if (currentInput !== '0') {
        currentInput = (stringToNumber(currentInput) / 100).toString();
        const digitCount = currentInput.replace('.','').length;
        if (digitCount >= MAX_DISPLAY_LENGTH){
            currentInput = currentInput.slice(0,MAX_DISPLAY_LENGTH+1);
        }
        updateResultDisplay();
    }
    document.getElementById('container').focus();
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const digitCount = currentInput.replace('.','').length;
    if(/^[0-9]$/.test(key)){
        const activeElement = document.activeElement;
        if(activeElement !== resultDisplay && !activeElement.classList.contains('button')){
            if(overwriteDisplay){
                currentInput = key;
                overwriteDisplay = false;
            }else if (digitCount < MAX_DISPLAY_LENGTH){
                currentInput+=key;
            }
            updateResultDisplay(); 
            numberButtons.forEach(button=>{ 
                if(button.textContent.trim()===key){
                    animateButton(button);
                }
            });
        
        }
        document.getElementById('container').focus();
        return;
    } else if(key ==='.'){
        const activeElement = document.activeElement;
        if(activeElement!==resultDisplay && !activeElement.classList.contains('button') && !resultDisplay.textContent.includes('.')){
            if(overwriteDisplay){
                currentInput = '0.';
                overwriteDisplay = false;
            } else if (!currentInput.includes('.')){
                currentInput+=key;
            }
            updateResultDisplay();
            numberButtons.forEach(button=>{
                if(button.textContent.trim()===key){
                    animateButton(button);
                }
            });
        }
        document.getElementById('container').focus();
        return;
    }else if(key==='Backspace'){
        if(currentInput.length>1){
            currentInput=currentInput.slice(0,-1);
        } else{
            currentInput = '0';
            overwriteDisplay = true;
        }
        updateResultDisplay();
        const backspaceBtn = Array.from(allButtons).find(button => button.querySelector('i.material-icons[style*="font-size:12px"]')?.textContent === 'backspace');
        if (backspaceBtn) {
            animateButton(backspaceBtn);
        }
        document.getElementById('container').focus();
        return;
    }

    allButtons.forEach(button =>{
        const buttonText = button.textContent.trim();
        if(key == buttonText){
            button.click();
            animateButton(button);
        } else if(key === '*' && buttonText ==='x'){
            button.click();
            animateButton(button);
        } else if(key ==='/' && buttonText ==='÷'){
            button.click();
            animateButton(button);
        } else if(key ==='Enter' && buttonText==='='){
            button.click();
            animateButton(button);
        }  else if (key === '-' && buttonText === '-') { 
            button.click();
            animateButton(button);
        } else if (key === '+' && buttonText === '+') { 
            button.click();
            animateButton(button);
        } else if (key === '%' && buttonText === '%') { 
            button.click();
            animateButton(button);
        }else if ((key === 'Delete') && buttonText === 'C') { 
            button.click();
            animateButton(button);
            currentInput = '0';
            overwriteDisplay = true;
            updateResultDisplay();
        }
    });
    document.getElementById('container').focus();
});



