import { distance } from "fastest-levenshtein";
export function compareText(original: any, spoken: string, currentIndex: number) {
    console.log(spoken, '--------------------------------------------------------')
    if (!original?.ayahs?.length) return;
    let nextIndex: number = currentIndex;
    original = removeDiacritics(original?.ayahs[currentIndex]?.text);
    let originalWords = original.split(" ");
    let length: number = 0;
    let spokenWords = spoken.trim()?.split(" ");
    spokenWords = spokenWords.filter(str => str.trim() !== '');
    console.log(originalWords);
    console.log(spokenWords);
    if (originalWords.length < spokenWords.length) {
        nextIndex = currentIndex + 1;
        length = originalWords.length
    };
    // spokenWords.length = originalWords.length
    const checkedData = originalWords.map((word: any, index: number) => ({
        word,
        spoken: spokenWords[index],
        status: distance(word, spokenWords[index] || "") <= 2 ? "correct" : "wrong",
    }))
    return { [currentIndex]: checkedData, index: nextIndex, length };
}

function removeDiacritics(str: string) {
    console.log(str);
    return str?.normalize("NFD").replace(/[\u064B-\u0652\u0670]/g, "");
}

