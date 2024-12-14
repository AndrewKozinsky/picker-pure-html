
export type PickerUnsafeConfig = {
	minValue: unknown
	maxValue: unknown
	step: unknown
	initialValue: unknown
	currency: unknown
}

export type PickerConfig = {
	minValue: number
	maxValue: number
	step: number
	initialValue: number
	currency: string
}

export type Store = {
	minValue: number
	maxValue: number
	step: number
	value: number
	currency: string
}

export enum BottomButtonText {
	'_25' = '25%',
	'_50' = '50%',
	'_75' = '75%',
	'_100' = '100%'
}

export type PickerElements = {
	$currencyInput: HTMLInputElement
	$currencyName: HTMLSpanElement
	$button_25: HTMLButtonElement
	$button_50: HTMLButtonElement
	$button_75: HTMLButtonElement
	$button_100: HTMLButtonElement
}