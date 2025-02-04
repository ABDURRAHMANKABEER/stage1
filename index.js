const hex = `${Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0')}`;

let score = Number(localStorage.getItem('score')) || 0;
function updateScore() {
    document.querySelector('.score').innerHTML = `Score: ${score}`;
}
updateScore();

function displayResult(result) {
    const displayElement = document.querySelector('.display')
    if(result === 'win') {
        if(displayElement.classList.contains('red')) {
            displayElement.classList.remove('red');
            displayElement.classList.add('green');
            displayElement.innerHTML = 'Correct!';
        }else {
            displayElement.classList.add('green');
            displayElement.innerHTML = 'Correct!';
        }
    }else {
        if(displayElement.classList.contains('green')) {
            displayElement.classList.remove('green');
            displayElement.classList.add('red');
            displayElement.innerHTML = 'Incorrect!';
        } else {
            displayElement.classList.add('red');
            displayElement.innerHTML = 'Incorrect!';
        }
    }
}

function hexToRgb(hex) {
    
    //parseing hex to rgb component
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 225;
    const g = (bigint >> 8) & 225;
    const b = bigint & 225;
    return { r, g, b };
};

function rgbToHex(r, g, b) {

    // converting rgb values to hex string
    return `#${((1<<24) | (r<<16) | (g<<8) | b).toString(16).slice(1)}`;
};

function adjustShade(hex, percent) {

    //convert hex to rgb
    const {r, g, b} = hexToRgb(hex);
    // adjusting rgb values by percent
    const adjust = value => Math.min(225, Math.max(0, value+ Math.round(value*(percent/100))));
    const newR = adjust(r);
    const newG = adjust(g);
    const newB = adjust(b);
    
    return rgbToHex( newR, newG, newB) ;
};

let shades = [`#${hex}`];

//assigning background to buttons
for(i = -60; i <= 60; i+=30) {
    const shade = adjustShade(hex, i);
    shades.push(shade);
};

for(i=0; i<shades.length; i++) {
    const btnElement = document.querySelector(`.btn-${i}`)
    btnElement.style.background = shades[i];
    btnElement.dataset.background = shades[i];
}

//Random color for target box
function getRandomColor() {
    const index = Math.floor(Math.random()* shades.length);
    return index;
};

let randomColor;
function useColor() {
   const index = getRandomColor();
   randomColor = shades[index];
   const targetElement = document.querySelector(`.target-box`)
   targetElement.style.background = randomColor;
};

useColor();

//comparing color
let background;
for(i = 0; i<shades.length; i++) {
    const myElement = document.querySelector(`.btn-${i}`)
        myElement.addEventListener('click', () => {
            hexCode = myElement.dataset.background;
            if(hexCode === randomColor) {
                score++;
                updateScore();
                displayResult('win');
                localStorage.setItem('score', String(score));
                setTimeout(()=> {
                    window.location.reload();
                }, 1000);
            } else {
                displayResult('lose');
                setTimeout(()=> {
                    window.location.reload();
                }, 800);
            }
        });
};

function reset() {
    document.querySelector('.reset')
        .addEventListener('click', ()=> {
            score = 0;
            updateScore();
            localStorage.removeItem('score');
        });
};
reset();