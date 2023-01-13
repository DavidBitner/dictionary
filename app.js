const btn = document.querySelector(`#search-btn`);
const form = document.querySelector(`#form`);
const results = document.querySelector(`.results`);
const sound = document.querySelector(`#sound`);

async function queryDictionary(word) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`
  );
  const data = await response.json();
  const wordData = data[0];

  if (!wordData) {
    return undefined;
  }

  const object = {
    word: wordData.word,
    type: `${wordData.meanings[0].partOfSpeech}${
      wordData.phonetic ? ` ${wordData.phonetic}` : ""
    }`,
    meaning: wordData.meanings[0].definitions[0].definition,
    example: wordData.meanings[0].definitions[0].example,
    sound: wordData.phonetics[0].audio
      ? wordData.phonetics[0].audio
      : undefined,
  };

  return object;
}

function showWordMeaning(wordData) {
  results.innerHTML = `
    <div class="result__word">${wordData.word}</div>
    <div class="result__type">${wordData.type}</div>
    <div class="result__meaning">${wordData.meaning}</div>
    ${
      wordData.example
        ? `<div class="result__example">${wordData.example}</div>`
        : ""
    }
    ${
      wordData.sound
        ? `<div class="result__listen btn" id="sound-btn">♬</div>`
        : ""
    }
    
  `;
  sound.setAttribute("src", wordData.sound);
  results.style.display = "grid";
}

function wordError() {
  results.innerHTML = `
    <div class="result__error">No definitions found!</div>
  `;
  results.style.display = "grid";
}

async function searchWordMeaning(event) {
  event.preventDefault();

  const inputSearch = document.querySelector(`#search-input`).value;
  const wordData = await queryDictionary(inputSearch);

  if (!wordData) {
    wordError();
    return;
  }

  showWordMeaning(wordData);
}

function handleSound(event) {
  if (event.target.id == "sound-btn") {
    sound.play();
  }
}

form.addEventListener("submit", searchWordMeaning);
results.addEventListener("click", handleSound);
