'use strict';

import { currency_list } from './modules/currencies.js';

///////////////////////SELECTORS
const select1 = document.getElementById('selector-1');
const select2 = document.getElementById('selector-2');
const exchangeCalcText = document.getElementById('exchange-rate');
const calculatedValue = document.getElementById('number-2');
const calcBtn = document.getElementById('calc-btn');
const inputAmount = document.getElementById('number-1');
const swapBtn = document.getElementById('swap');

let URL;
let exchageRate;
let selectedValue1;
let selectedValue2;
let name1;
let name2;

/////////////////////////////PAGE SETUP

//populate currency selector forms with info
for (var i = 0; i < currency_list.length; i++) {
  var curOption = currency_list[i].code;
  var el = document.createElement('option');
  el.textContent = curOption;
  el.value = curOption;
  select1.appendChild(el);
}
for (var i = 0; i < currency_list.length; i++) {
  var curOption = currency_list[i].code;
  var el = document.createElement('option');
  el.textContent = curOption;
  el.value = curOption;
  select2.appendChild(el);
}

///////////////////////FUNCTIONS

//calculate and display exchange rate
const convertVal = function () {
  let amount = Number(inputAmount.value) * exchageRate;
  calculatedValue.value = `${amount}`;
};

//change 1 USD = 1 USD string
const changeString = function () {
  getNames();
  exchangeCalcText.innerText = `1 ${name1} (${selectedValue1}) = ${exchageRate} ${name2} (${selectedValue2})`;
};

//get name info for currency (to use in conversion rate string)
const getNames = function () {
  let found1 = currency_list.find((el) => el.code === selectedValue1);
  let found2 = currency_list.find((el) => el.code === selectedValue2);

  name1 = found1.name;
  name2 = found2.name;
};

//get exchange data from API
const getData = async function () {
  try {
    const res = await fetch(URL);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    exchageRate = data.conversion_rate;

    convertVal();
    changeString();
  } catch (err) {
    alert(err);
  }
};

//get value of form indexes
const setIndex = function () {
  selectedValue1 = select1.options[select1.selectedIndex].text;
  selectedValue2 = select2.options[select2.selectedIndex].text;
};

//Calculate Rate button - takes form select info, generates URL for API, then calls getData to retrieve
const queryAPI = function () {
  setIndex();
  URL = `https://v6.exchangerate-api.com/v6/4a481ade6b3525871bd0c277/pair/${selectedValue1}/${selectedValue2}`;
  getData();
};

calcBtn.addEventListener('click', function () {
  queryAPI();
});

//swap values between form elements, and replace text in conversion rate string
swapBtn.addEventListener('click', function () {
  setIndex();

  const current1 = select1.selectedIndex;
  const current2 = select2.selectedIndex;
  select1.selectedIndex = current2;
  select2.selectedIndex = current1;

  queryAPI();
  changeString();
});
