import { DISASSEMBLED_CONSONANTS_BY_CONSONANT, DISASSEMBLED_VOWELS_BY_VOWEL } from './constants';
import { disassembleCompleteHangulCharacter } from './disassembleCompleteHangulCharacter';

export function disassembleHangulToGroups(str: string) {
    const result: string[][] = [];

    for (const letter of str) {
        const disassembledComplete = disassembleCompleteHangulCharacter(letter);

        if (disassembledComplete != null) {
            result.push([...disassembledComplete.first, ...disassembledComplete.middle, ...disassembledComplete.last]);
            continue;
        }

        const disassembledConsonant = DISASSEMBLED_CONSONANTS_BY_CONSONANT[letter];

        if (disassembledConsonant != null) {
            result.push([...disassembledConsonant]);
            continue;
        }

        const disassembledVowel = DISASSEMBLED_VOWELS_BY_VOWEL[letter];

        if (disassembledVowel != null) {
            result.push([...disassembledVowel]);
            continue;
        }

        result.push([letter]);
    }

    return result;
}

export function disassembleHangul(str: string) {
    return disassembleHangulToGroups(str).reduce((hanguls, disassembleds) => `${hanguls}${disassembleds.join('')}`, '');
}
