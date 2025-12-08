// assets/js/custom.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contact-form');
  if (!form) return; // jei nėra formos – išeinam

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const addressInput = document.getElementById('address');
  const q1Input = document.getElementById('q1');
  const q2Input = document.getElementById('q2');
  const q3Input = document.getElementById('q3');
  const submitBtn = document.getElementById('submitBtn');

  const resultsContainer = document.getElementById('form-results');
  const popup = document.getElementById('success-popup');
  const closePopupBtn = document.getElementById('closePopupBtn');

  // PAGALBINĖS FUNKCIJOS KLAIDOMS

  function setError(input, message) {
    if (!input) return;
    input.classList.add('error');
    const msgEl = input.parentElement.querySelector('.error-message');
    if (msgEl) {
      msgEl.textContent = message || '';
    }
  }

  function clearError(input) {
    if (!input) return;
    input.classList.remove('error');
    const msgEl = input.parentElement.querySelector('.error-message');
    if (msgEl) {
      msgEl.textContent = '';
    }
  }

  function isEmpty(value) {
    return !value || value.trim() === '';
  }

  function isOnlyLetters(value) {
    return /^[A-Za-zĄČĘĖĮŠŲŪąčęėįšųūŽž\s-]+$/.test(value.trim());
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidRating(value) {
    const num = Number(value);
    return Number.isFinite(num) && num >= 1 && num <= 10;
  }

  // TELEFONO FORMATAVIMAS: +370 6xx xxxxx

  function formatPhone(value) {
    // paliekam tik skaitmenis, max 11 skaitmenų (3706xxxxx)
    let digits = value.replace(/\D/g, '').slice(0, 11);

    let country = digits.slice(0, 3); // 370
    let first = digits.slice(3, 4);   // 6
    let mid = digits.slice(4, 6);     // xx
    let last = digits.slice(6, 11);   // xxxxx

    let formatted = '';

    if (country) {
      formatted = '+' + country;
    }
    if (first) {
      formatted += ' ' + first + mid;
    }
    if (last) {
      formatted += ' ' + last;
    }

    return formatted;
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    // turi būti 11 skaitmenų ir prasidėti 3706
    return digits.length === 11 && digits.startsWith('3706');
  }

  // VIENO LAUKO VALIDACIJA

  function validateField(input) {
    if (!input) return false;
    const id = input.id;
    const value = input.value;

    // tuščias
    if (isEmpty(value)) {
      setError(input, 'Šis laukas yra privalomas');
      return false;
    }

    if (id === 'firstName' || id === 'lastName') {
      if (!isOnlyLetters(value)) {
        setError(input, 'Naudok tik raides');
        return false;
      }
    }

    if (id === 'email') {
      if (!isValidEmail(value)) {
        setError(input, 'Neteisingas el. pašto formatas');
        return false;
      }
    }

    if (id === 'address') {
      // tiesiog turi nebūti tuščias
      clearError(input);
      return true;
    }

    if (id === 'q1' || id === 'q2' || id === 'q3') {
      if (!isValidRating(value)) {
        setError(input, 'Įvesk skaičių nuo 1 iki 10');
        return false;
      }
    }

    if (id === 'phone') {
      if (!isValidPhone(value)) {
        setError(input, 'Numeris turi būti formato +370 6xx xxxxx');
        return false;
      }
    }

    clearError(input);
    return true;
  }

  // VISOS FORMOS VALIDACIJA + SUBMIT MYGTUKO ĮJUNGIMAS/IŠJUNGIMAS

  function validateFormAndToggleSubmit() {
    const fields = [
      firstNameInput,
      lastNameInput,
      emailInput,
      phoneInput,
      addressInput,
      q1Input,
      q2Input,
      q3Input
    ];

    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    if (submitBtn) {
      submitBtn.disabled = !allValid;
    }

    return allValid;
  }

  // REAL-TIME VALIDACIJA ĮVESTIES METU

  [firstNameInput, lastNameInput, emailInput, addressInput, q1Input, q2Input, q3Input].forEach(input => {
    if (!input) return;
    input.addEventListener('input', function () {
      validateField(input);
      validateFormAndToggleSubmit();
    });
  });

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      const formatted = formatPhone(phoneInput.value);
      phoneInput.value = formatted;
      validateField(phoneInput);
      validateFormAndToggleSubmit();
    });
  }

  // POP-UP VALDYMAS

  function showPopup() {
    if (popup) {
      popup.classList.add('show');
    }
  }

  function hidePopup() {
    if (popup) {
      popup.classList.remove('show');
    }
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', hidePopup);
  }

  if (popup) {
    popup.addEventListener('click', function (e) {
      if (e.target === popup) {
        hidePopup();
      }
    });
  }

  // FORMOS SUBMIT

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // sustabdom persikrovimą

    const isValid = validateFormAndToggleSubmit();
    if (!isValid) {
      return;
    }

    const formData = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      q1: Number(q1Input.value),
      q2: Number(q2Input.value),
      q3: Number(q3Input.value)
    };

    // objektas į konsolę
    console.log('Kontaktų forma:', formData);

    const avg = (formData.q1 + formData.q2 + formData.q3) / 3;

    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <p><strong>Vardas:</strong> ${formData.firstName}</p>
        <p><strong>Pavardė:</strong> ${formData.lastName}</p>
        <p><strong>El. paštas:</strong> ${formData.email}</p>
        <p><strong>Tel. numeris:</strong> ${formData.phone}</p>
        <p><strong>Adresas:</strong> ${formData.address}</p>
        <p><strong>Įvertinimai:</strong> ${formData.q1}, ${formData.q2}, ${formData.q3}</p>
        <p><strong>${formData.firstName} ${formData.lastName}:</strong> ${avg.toFixed(1)}</p>
      `;
    }

    showPopup();

    // jei norėsi – gali išvalyti formą:
    // form.reset();
    // validateFormAndToggleSubmit();
  });

  // pradinė būsena
  validateFormAndToggleSubmit();
});

const board = document.getElementById("game-board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("win-message");
const difficultySelect = document.getElementById("difficulty");

let moves = 0;
let matches = 0;
let flippedCards = [];
let cardValues = [];

// 6 unikalūs elementai — automatiškai dubliuojami
const baseItems = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍"];

function startGame() {
    moves = 0;
    matches = 0;
    flippedCards = [];
    winMessage.textContent = "";

    movesEl.textContent = 0;
    matchesEl.textContent = 0;

    generateBoard();
}

function generateBoard() {
    board.innerHTML = "";

    let gridSize = difficultySelect.value === "easy" ? 12 : 24;
    let neededPairs = gridSize / 2;

    // paimame tiek elementų kiek reikia
    let selectedItems = baseItems.slice(0, neededPairs);

    // dubliuojame masyvą, kad būtų poros
    cardValues = [...selectedItems, ...selectedItems];

    // sumaišome
    cardValues.sort(() => Math.random() - 0.5);

    // nustatome grid dydį
    board.style.gridTemplateColumns =
        difficultySelect.value === "easy" ? "repeat(4, 1fr)" : "repeat(6, 1fr)";

    // sugeneruojame korteles
    cardValues.forEach((value, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;
        card.dataset.value = value;

        card.addEventListener("click", () => flipCard(card));

        board.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains("flipped") || card.classList.contains("matched"))
        return;

    if (flippedCards.length === 2) return;

    card.classList.add("flipped");
    card.textContent = card.dataset.value;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesEl.textContent = moves;

        setTimeout(checkMatch, 700);
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;

    if (c1.dataset.value === c2.dataset.value) {
        c1.classList.add("matched");
        c2.classList.add("matched");
        matches++;
        matchesEl.textContent = matches;
    } else {
        c1.classList.remove("flipped");
        c2.classList.remove("flipped");
        c1.textContent = "";
        c2.textContent = "";
    }

    flippedCards = [];

    if (matches === cardValues.length / 2) {
        winMessage.textContent = "🎉 Laimėjote!";
    }
}

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", startGame);

// automatinis užkrovimas pirmą kartą
startGame();
