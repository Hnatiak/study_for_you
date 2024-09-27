const resultBox = document.querySelector(".result");
const inputBox = document.getElementById("input-box");
const resultBtnBox = document.querySelector(".result-box");
const errorBox = document.querySelector(".error-box");

let jsonData = {};

fetch('result.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

inputBox.onkeyup = function() {
    let result = [];
    let input = inputBox.value.toLowerCase().trim();

    if (input.length) {
        jsonData.messages.forEach(message => {
            message.text_entities.forEach(entity => {
                if (entity.text.toLowerCase().includes(input)) {
                    result.push(entity.text);
                }
            });
        });
    }

    displayResults(result, input);
};

function displayResults(results, input) {
    resultBox.innerHTML = "";

    if (results.length === 0) {
        resultBtnBox.style.display = "none";
        errorBox.style.display = "flex";
        if (input.length === 0) {
            errorBox.style.display = "none";
            return;
        }
        return;
    }

    resultBtnBox.style.display = "flex";
    errorBox.style.display = "none";

    results.forEach(result => {
        const div = document.createElement("div");
        const maxLength = 140;
        let displayText = formatText(result, input);
        
        if (displayText.length > maxLength) {
            const shortText = displayText.slice(0, maxLength) + "...";
            const showMoreButton = document.createElement("button");
            showMoreButton.textContent = "Show more";
            
            const showLessButton = document.createElement("button");
            showLessButton.textContent = "Show less";
            showLessButton.style.display = "none";
            
            div.innerHTML = shortText;
            div.appendChild(showMoreButton);

            showMoreButton.addEventListener("click", function() {
                div.innerHTML = displayText;
                div.appendChild(showLessButton);
                showMoreButton.style.display = "none";
                showLessButton.style.display = "inline";
            });

            showLessButton.addEventListener("click", function() {
                div.innerHTML = shortText;
                div.appendChild(showMoreButton);
                showLessButton.style.display = "none";
                showMoreButton.style.display = "inline";
            });
        } else {
            div.innerHTML = displayText;
        }
        
        resultBox.appendChild(div);
    });
}

function formatText(text, term) {
    let highlightedText = highlightText(text, term);
    return highlightedText.replace(/\n/g, '<br>');
}

function highlightText(text, term) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1) {
        return insertMark(text, index, term.length);
    }
    return text;
}

function insertMark(string, pos, len) {
    return string.slice(0, pos) + "<mark>" + string.slice(pos, pos + len) + "</mark>" + string.slice(pos + len);
}