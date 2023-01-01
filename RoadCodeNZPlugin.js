// ==UserScript==
// @name         Adding Favorite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add favorite questions for road code practice.
// @author       Wizdzz
// @match        https://roadcode.kannz.com/study/question/*
// @match        https://roadcode.kannz.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kannz.com
// @grant        none
// ==/UserScript==

const FAVORITE_QUESTIONS_KEY_NAME = 'favoriteQuestions';
let favoriteQuestions;
let currentQuestionId;
let favoriteQuestionMode = false;

function getCurrentQuestionId(){
    let qMarkIndex = location.href.indexOf('?');
    return qMarkIndex < 0 ? location.href.slice(location.href.lastIndexOf('/') + 1)
        : location.href.slice(location.href.lastIndexOf('/') + 1, qMarkIndex);
}

function createAddFavoriteEle(){
    let ele = document.createElement('label');

    let tr = document.createElement('tr');
    tr.appendChild(ele);

    let lastTr = document.querySelector('main table tbody tr:nth-last-child(1)');
    document.querySelector('main table tbody').insertBefore(tr, lastTr);

    ele.outerHTML = '<label style="user-select: none;"><input id="add-favorite" type="checkbox" style="margin-right: 0.5em;"/> Add favorite</label>';
    ele.style.userSelect = 'none';

    let input = document.querySelector('#add-favorite');
    if(favoriteQuestions.includes(currentQuestionId)){
        input.checked = 'true';
    }

    return input;
}

function updateFavoriteQuestions(){
    localStorage.setItem(FAVORITE_QUESTIONS_KEY_NAME, JSON.stringify(favoriteQuestions));
}

function getFavoriteQuestions(){
    let raw = localStorage.getItem(FAVORITE_QUESTIONS_KEY_NAME);
    return raw === null ? [] : JSON.parse(raw);
}

function addClickListener(ele) {
    ele.addEventListener('change', () => {
        if(ele.checked) {
            if (!favoriteQuestions.includes(currentQuestionId)) {
                favoriteQuestions.push(currentQuestionId);
                updateFavoriteQuestions();
            }
        }
        else {
            if (favoriteQuestions.includes(currentQuestionId)) {
                favoriteQuestions = favoriteQuestions.filter(item => item !== currentQuestionId);
                updateFavoriteQuestions();
            }
        }
    });
}

function changePreNextQuestionBtn(){
    let currentQIndex = favoriteQuestions.indexOf(currentQuestionId);

    if (favoriteQuestions.length > 0 && favoriteQuestions.includes(currentQuestionId)) {
        let lastTr = document.querySelector('main table tbody tr:nth-last-child(1)');
        let allAnchor = lastTr.querySelectorAll('a');

        if (currentQIndex - 1 >= 0) {
            allAnchor[0].href = `https://roadcode.kannz.com/study/question/${favoriteQuestions[currentQIndex - 1]}?favoriteQuestionMode=true`;
        }
        else{
            allAnchor[0].attributes.removeNamedItem('href');

            allAnchor[0].addEventListener('click', () => {
                alert('This is the first favorite question.');
            });
        }

        if (currentQIndex + 1 < favoriteQuestions.length) {
            allAnchor[1].href = `https://roadcode.kannz.com/study/question/${favoriteQuestions[currentQIndex + 1]}?favoriteQuestionMode=true`;
        }
        else{
            allAnchor[1].attributes.removeNamedItem('href');

            allAnchor[1].addEventListener('click', () => {
                alert('This is the last favorite question.');
            });
        }
    }
}

function addFavoriteQuestionBtn() {
    let a = document.createElement('a');
    a.classList.add('btn');
    a.classList.add('btn-outline-primary');
    a.classList.add('btn-outline-primary');

    a.innerText = 'Favorite Questions';
    if(favoriteQuestions.length > 0) {
        a.href = `https://roadcode.kannz.com/study/question/${favoriteQuestions[0]}?favoriteQuestionMode=true`;
    }
    else{
        a.addEventListener('click', () => {
            alert('There is no favorite question marked!');
        });
    }

    document.querySelector('main .btn').parentNode.appendChild(a);
}

function addFavoriteQuestionH1(){
    let h1 = document.createElement('h1');
    h1.innerText = 'Favorite Question Mode';

    let div = document.createElement('div');
    div.appendChild(h1);
    div.style.textAlign = 'center';
    div.style.marginBottom = '2em';

    let container = document.querySelector('main').parentNode;
    container.insertBefore(div, container.firstElementChild);
}

(function() {
    'use strict';

    favoriteQuestions = getFavoriteQuestions();

    if(location.href.startsWith('https://roadcode.kannz.com/study/question/')) {
        currentQuestionId = getCurrentQuestionId();
        favoriteQuestionMode = location.href.includes('favoriteQuestionMode=true');

        let ele = createAddFavoriteEle();
        addClickListener(ele);

        if(favoriteQuestionMode) {
            changePreNextQuestionBtn();
            addFavoriteQuestionH1();
        }
    }
    else if (location.href === 'https://roadcode.kannz.com/'){
        addFavoriteQuestionBtn();
    }
})();