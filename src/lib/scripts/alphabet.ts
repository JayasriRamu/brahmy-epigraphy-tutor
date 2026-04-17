export interface BrahmiChar {
	tamil: string;
	brahmi: string;
	phonetic: string;
	type: 'Uyir' | 'Mei' | 'Uyirmei' | 'Special';
}

export const ALPHABET: Record<string, BrahmiChar> = {
	// Vowels (Uyir) - 12 vowels
	அ: { tamil: 'அ', brahmi: '𑀅', phonetic: 'a', type: 'Uyir' },
	ஆ: { tamil: 'ஆ', brahmi: '𑀆', phonetic: 'aa', type: 'Uyir' },
	இ: { tamil: 'இ', brahmi: '𑀇', phonetic: 'i', type: 'Uyir' },
	ஈ: { tamil: 'ஈ', brahmi: '𑀈', phonetic: 'ii', type: 'Uyir' },
	உ: { tamil: 'உ', brahmi: '𑀉', phonetic: 'u', type: 'Uyir' },
	ஊ: { tamil: 'ஊ', brahmi: '𑀊', phonetic: 'uu', type: 'Uyir' },
	எ: { tamil: 'எ', brahmi: '𑀏', phonetic: 'e', type: 'Uyir' },
	ஏ: { tamil: 'ஏ', brahmi: '𑀺', phonetic: 'ee', type: 'Uyir' },
	ஐ: { tamil: 'ஐ', brahmi: '𑀐', phonetic: 'ai', type: 'Uyir' },
	ஒ: { tamil: 'ஒ', brahmi: '𑀑', phonetic: 'o', type: 'Uyir' },
	ஓ: { tamil: 'ஓ', brahmi: '𑀒', phonetic: 'oo', type: 'Uyir' },
	ஔ: { tamil: 'ஔ', brahmi: '𑀔', phonetic: 'au', type: 'Uyir' },

	// Consonants (Mei) - 18 consonants in Tamil table order
	க: { tamil: 'க', brahmi: '𑀓', phonetic: 'ka', type: 'Uyirmei' },
	ங: { tamil: 'ங', brahmi: '𑀘', phonetic: 'nga', type: 'Mei' },
	ச: { tamil: 'ச', brahmi: '𑀙', phonetic: 'cha', type: 'Uyirmei' },
	ஞ: { tamil: 'ஞ', brahmi: '𑀜', phonetic: 'nya', type: 'Mei' },
	ட: { tamil: 'ட', brahmi: '𑀝', phonetic: 'ṭa', type: 'Uyirmei' },
	ண: { tamil: 'ண', brahmi: '𑀡', phonetic: 'ṇa', type: 'Mei' },
	த: { tamil: 'த', brahmi: '𑀢', phonetic: 'ta', type: 'Uyirmei' },
	ந: { tamil: 'ந', brahmi: '𑀦', phonetic: 'na', type: 'Mei' },
	ப: { tamil: 'ப', brahmi: '𑀧', phonetic: 'pa', type: 'Uyirmei' },
	ம: { tamil: 'ம', brahmi: '𑀫', phonetic: 'ma', type: 'Uyirmei' },
	ய: { tamil: 'ய', brahmi: '𑀬', phonetic: 'ya', type: 'Uyirmei' },
	ர: { tamil: 'ர', brahmi: '𑀭', phonetic: 'ra', type: 'Uyirmei' },
	ல: { tamil: 'ல', brahmi: '𑀮', phonetic: 'la', type: 'Uyirmei' },
	வ: { tamil: 'வ', brahmi: '𑀯', phonetic: 'va', type: 'Uyirmei' },
	ழ: { tamil: 'ழ', brahmi: '𑀴', phonetic: 'ḻa', type: 'Mei' },
	ள: { tamil: 'ள', brahmi: '𑀵', phonetic: 'lla', type: 'Mei' },
	ற: { tamil: 'ற', brahmi: '𑀶', phonetic: 'ṟa', type: 'Mei' },
	ன: { tamil: 'ன', brahmi: '𑀷', phonetic: 'nna', type: 'Mei' },

	// Special - use 'Special' type so they're not picked up in vowels/consonants
	' ': { tamil: '', brahmi: '·', phonetic: 'Space', type: 'Special' },
	fallback: { tamil: '', brahmi: '𑀀', phonetic: 'Symbol', type: 'Special' }
};
