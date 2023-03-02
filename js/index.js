{
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const selectTag = $$('select');
    const icons = $$('.row i');
    const exchangeBtn = $('.exchange');
    const fromText = $('.from-text');
    const toText = $('.to-text');
    const [translateInput, translateOutput] = selectTag;

    selectTag.forEach((element, index) => {
        for (const country in countries) {
            let selected;
            if (index == 0 && country == 'en-US') {
                selected = 'selected';
            } else if (index == 1 && country == 'vi-VN') {
                selected = 'selected';
            }
            let option = `<option value="${country}" ${selected}>${countries[country]}</option>`;
            element.insertAdjacentHTML('beforeend', option);
        }
    });

    icons.forEach((icon, index) => {
        icon.onclick = () => {
            let target = icons[index];
            if (target.classList.contains('copy-text')) {
                if (target.id == 'from') {
                    navigator.clipboard.writeText(fromText.value);
                } else {
                    navigator.clipboard.writeText(toText.value);
                }
            } else {
                if (target.id == 'from') {
                    handleSpeak(fromText.value, translateInput.value);
                } else {
                    handleSpeak(toText.value, translateOutput.value);
                }
            }
        };
    });

    //Handle event
    fromText.onkeyup = handleTranslate;
    exchangeBtn.onclick = swapLanguage;

    function swapLanguage() {
        const tempText = fromText.value,
            tempSelect = translateInput.value;
        fromText.value = toText.value;
        toText.value = tempText;

        translateInput.value = translateOutput.value;
        translateOutput.value = tempSelect;
    }

    let timerId;
    function handleTranslate() {
        toText.setAttribute('placeholder', 'Translating...');
        toText.value = '';
        if (timerId) {
            clearTimeout(timerId);
        }
        let translate = fromText.value;
        if (translate) {
            timerId = setTimeout(async () => {
                let translateFrom = translateInput.value,
                    translateTo = translateOutput.value;

                let apiUrl = `https://api.mymemory.translated.net/get?q=${translate}!&langpair=${translateFrom}|${translateTo}`;
                let apiGoogle = `https://translate.googleapis.com/translate_a/single?client=gtx&s${translateFrom}&tl1=${translateTo}&dt=t&q=${translate}`;

                const response = await fetch(apiUrl);
                const data = await response.json();

                toText.value = data.responseData.translatedText;
                toText.setAttribute('placeholder', 'Translation');
            }, 500);
        } else {
            toText.value = '';
            toText.setAttribute('placeholder', 'Translation');
        }
    }

    function handleSpeak(msg, lang) {
        function getVoices() {
            let voices = speechSynthesis.getVoices();
            if (!voices.length) {
                let utterance = new SpeechSynthesisUtterance('');
                speechSynthesis.speak(utterance);
                voices = speechSynthesis.getVoices();
            }
            return voices;
        }

        let textToSpeak = msg;

        let speakData = new SpeechSynthesisUtterance();
        speakData.volume = 1;
        speakData.rate = 1;
        speakData.pitch = 2;
        speakData.text = textToSpeak;
        speakData.lang = lang;
        if (lang == 'vi-VN') {
            speakData.voice = getVoices()[0];
        } else {
            speakData.voice = getVoices()[2];
        }
        speechSynthesis.speak(speakData);
    }
}
