/*!
 * Scramble v3.0.1
 * Copyright(c) 2019 Ignatius Bagus
 * MIT Licensed
 * scramble.js.org
 */

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self).scramble=e()}(this,function(){"use strict";function t(t){const e=t.getBoundingClientRect();return e.bottom>0&&e.right>0&&e.left<(window.innerWidth||document.documentElement.clientWidth)&&e.top<(window.innerHeight||document.documentElement.clientHeight)}function e(t){let e="";const n=()=>String.fromCharCode(r.random(33,126));for(let r=0;r<t;r++)e+=n();return e}function n(t){const n=t.textContent,o=n.length,i=()=>t.textContent=e(o);let l=setInterval(i,r.interval),s=!0;return{original:n,start:()=>{if(s)throw new Error("Instance is already running!");s=!0,l=setInterval(i,r.interval)},stop:()=>{s&&(s=!1,clearInterval(l))}}}function r(o,i){if(null!=o){if(o instanceof NodeList){const e=Array.from(o).map(t=>r(t)),n=Array(o.length).fill(!1),i=["load","scroll"];for(let r=0;r<o.length;r++)for(const l of i)window.addEventListener(l,function i(){n[r]&&window.removeEventListener(l,i),!n[r]&&t(o[r])&&(n[r]=!0,e[r].run())});return{status:()=>n.every(t=>t)}}if(o instanceof HTMLElement){let t,l=!1,s=0;const u=(t=void 0===i?o.textContent:i.original).length,c=n(o);let a;const f=()=>{clearInterval(a),a=setInterval(()=>{s>=u&&clearInterval(a),o.textContent=function(t,n){return t.substring(0,n)+e(t.length-n)}(t,s)},r.interval),s++>=u?clearTimeout(f):setTimeout(f,432)};return{finished:()=>s>=u,run:()=>{l||(l=!0,c.stop(),f())},worker:c}}}}return r.interval=42,r.disorder=n,r.successive=function(t){const e=t=>{t>=n.length||(n[t].run(),setTimeout(function r(){n[t].finished()?e(t+1):setTimeout(r,1e3)},1e3))},n=Array.from(t).map(t=>r(t));return{run:()=>e(0)}},r.random=(t,e)=>Math.floor(Math.random()*(e-t+1))+t,r});
let inputs = {
    p: 0.000001, // The probability of password brute force during its validity
    v: 15, // Speed of password brute force
    t: 28800, // Maximum password term
    chars: ['numbers', 'letters'], // Valid: ['numbers', 'letters', 'lettersUpperCase', 'symbols']
};

let generator = {
    passwordBruteForceSpeed: 1,         // V +
    passwordSpaceStrong: 1,             // S
    maximumPasswordTerm: 1,             // T +
    probabilityBruteForce: 1,           // P +
    charactersInSpace: 0,               // A
    passwordLength: 1,                  // L
    chars: [],
    charSet: '',
    setPasswordBruteForceSpeed: function (speed) {
        this.passwordBruteForceSpeed = speed;
    },
    setMaximumPasswordTerm: function (term) {
        this.maximumPasswordTerm = term;
    },
    setProbabilityBruteForce: function (probability) {
        this.probabilityBruteForce = probability;
    },
    setCharactersInSpace: function (types) {
        this.chars = types;
    },
    setData: function (data) {
        this.setPasswordBruteForceSpeed(data.v);
        this.setMaximumPasswordTerm(data.t);
        this.setProbabilityBruteForce(data.p);
        this.setCharactersInSpace(data.chars);
        this.generateCharSet();
        this.getPasswordSpaceStrong();
        this.getPasswordLength();
    },
    getPasswordSpaceStrong: function () {
        this.passwordSpaceStrong = this.passwordBruteForceSpeed * this.maximumPasswordTerm / this.probabilityBruteForce;
        return this.passwordSpaceStrong;
    },
    getPasswordLength: function () {
        let passwordLength = Math.log(this.passwordSpaceStrong) / Math.log(this.charactersInSpace);
        this.passwordLength = Math.ceil(passwordLength);
        return this.passwordLength;
    },
    generateCharSet: function () {
        let charSet = '';
        let numbers = '0123456789';
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let symbols = ' (~!@#$%^&*_-+=`|\\(){}[]:;"\'<>,.?/)';
        if (this.chars.includes('numbers')) {
            charSet += numbers;
        }
        if (this.chars.includes('letters')) {
            charSet += letters;
        }
        if (this.chars.includes('lettersUpperCase')) {
            charSet += letters.toUpperCase();
        }
        if (this.chars.includes('symbols')) {
            charSet += symbols;
        }
        this.charSet = charSet;
        this.charactersInSpace = charSet.length;
        return this.charSet;
    },
    generatePassword: function (data) {
        if (data) this.setData(data);
        let password = '';
        let charsLength = this.charSet.length - 1;
        for (let index = this.passwordLength; index--; index <= 0) {
            let charNumber = (Math.random() * charsLength).toFixed();
            password += this.charSet[charNumber];
        }
        return password;
    },
    getFullReport: function () {
        console.group('REPORT: PASSWORD GENERATE');
        console.log('Password brute force Speed: ', this.passwordBruteForceSpeed);
        console.log('Password space strong: ', this.passwordSpaceStrong);
        console.log('Maximum password term: ', this.maximumPasswordTerm);
        console.log('Probability brute force: ', this.probabilityBruteForce);
        console.log('Characters in space: ', this.charactersInSpace);
        console.log('Password length: ', this.passwordLength);
        console.log('Chars: ', this.chars);
        console.log('Charset: ', this.charSet);
        console.log('Generated password: ', this.generatePassword());
        console.groupEnd();
    },
};

function generatorForm(formContainer, passwordBruteForceSpeedID, maximumPasswordTerm, probabilityBruteForce, validChars) {
    let colorBlocks = '.regeneratePassword, .generator__header,.gen-form__select';
    let passwordOutput = '.generator__header__password';
    $(formContainer).find('input').change( formWrapper );
    $('.regeneratePassword').click( formWrapper );

    function getInputs($formContainer) {
        let v = Number($formContainer.find(passwordBruteForceSpeedID).val());
        let p =  Number($formContainer.find(probabilityBruteForce).val());
        let t = Number($formContainer.find(maximumPasswordTerm).val());
        let chars = [];
        $(formContainer).find(validChars).find('input:checked').each( function () {
            chars.push(this.id)
        });
        return {p, v, t, chars};
    }
    
    function details() {
        $('.details').find('span').each( function () {
            let valueFull = generator[this.id];
            let value = valueFull.toString().split('').filter( e => e !== "0").join('');
            if (valueFull.toString().length > 4) {
                value = value + ' * 10^' + (valueFull.toString().length - value.toString().length)
            } else {
                value = valueFull;
            }
            $(this).text(value ? value : '-');
        })
    }

    function formWrapper(event) {
        let data = getInputs($(formContainer));
        generator.setData(data);

        details();

        if (data.v && data.p && data.t) {
            $(colorBlocks).removeClass('bg-warning');
            let password = generator.generatePassword();
            if (password === '') {
                password = 'Invalid options';
                $(colorBlocks).css({'transition': 'background-color 1s'}).addClass('bg-danger');
            } else {
                $(colorBlocks).removeClass('bg-danger');
            }
            $(passwordOutput).text(password);
        } else {
            $(colorBlocks).css({'transition': 'background-color 1s'}).addClass('bg-warning');
            $(passwordOutput).text('Enter correct data');
        }
    }
}


generatorForm(
    '.generator__body',
    '#passwordBruteForceSpeed',
    '#maximumPasswordTerm',
    '#probabilityBruteForce',
    '.charVariant');

$('.gen-form__select').change(selectEvent);

function selectEvent(event) {
    let $select = $(event.currentTarget);
    let $option = $($select.find('option[value="' + $select[0].value + '"]')[0]);
    $('#passwordBruteForceSpeed').val($option.attr('data-v'));
    $('#maximumPasswordTerm').val($option.attr('data-t'));
    $('#probabilityBruteForce').val($option.attr('data-p'));
    $('.regeneratePassword').click();
}


function copyPassword(button, passwordID) {
    console.log(document.querySelector(passwordID));
    let copyText = $(document.querySelector(passwordID));

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}