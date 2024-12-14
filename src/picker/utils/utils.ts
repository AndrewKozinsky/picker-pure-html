
export function unknownToNumber(value: unknown, defaultValue: unknown = 0): number {
	if (typeof value === 'number') {
		if (!isNaN(value)) return value

		if (typeof defaultValue === 'number') {
			return isNaN(defaultValue) ? 0 : defaultValue
		}
	} else if (typeof value === 'string') {
		if (!isNaN(+value)) return +value
	}

	return 0
}

export function unknownToString(value: unknown, defaultValue: unknown = ''): string {
	if (typeof value === 'string') {
		return value
	} else if (typeof defaultValue === 'string') {
		return defaultValue
	}

	return ''
}
