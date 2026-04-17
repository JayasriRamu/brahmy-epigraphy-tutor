const TAMIL_TO_BRAHMI: Record<string, string> = {
	அ: '𑀅',
	ஆ: '𑀆',
	இ: '𑀇',
	ஈ: '𑀈',
	உ: '𑀉',
	ஊ: '𑀊',
	க: '𑀓',
	ங: '𑀘',
	ச: '𑀙',
	ஞ: '𑀜',
	ட: '𑀝',
	ண: '𑀡',
	த: '𑀢',
	ந: '𑀦',
	ப: '𑀧',
	ம: '𑀫',
	ய: '𑀬',
	ர: '𑀭',
	ல: '𑀮',
	வ: '𑀯',
	ஶ: '𑀰',
	ஷ: '𑀱',
	ஸ: '𑀲',
	ஹ: '𑀳',
	ழ: '𑀴',
	ள: '𑀵',
	ற: '𑀶',
	ன: '𑀷'
};

export function tamilToBrahmi(tamilText: string): string[] {
	const brahmiChars: string[] = [];

	for (const char of tamilText) {
		if (TAMIL_TO_BRAHMI[char]) {
			brahmiChars.push(TAMIL_TO_BRAHMI[char]);
		} else {
			brahmiChars.push(char);
		}
	}

	return brahmiChars;
}

export function getBrahmiForTamil(tamilChar: string): string | null {
	return TAMIL_TO_BRAHMI[tamilChar] || null;
}

export function getTamilForBrahmi(brahmiChar: string): string | null {
	for (const [tamil, brahmi] of Object.entries(TAMIL_TO_BRAHMI)) {
		if (brahmi === brahmiChar) {
			return tamil;
		}
	}
	return null;
}
