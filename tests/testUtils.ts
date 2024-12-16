import fs from 'fs'
import {Window} from 'happy-dom'
import path from 'path'
import {vi} from 'vitest'
import {PickerElements} from '../src/picker/utils/types.ts'

export function get$pickerContainer() {
	const document = getMockerDocument()
	return document.querySelector('#app')! as any
}

export function get$picker($pickerContainer: HTMLElement) {
	return $pickerContainer.querySelector('.picker') as HTMLElement
}

export function getMockerDocument() {
	const htmlDocPath = path.join(__dirname, 'index.html')
	const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString()

	const window = new Window()
	const document = window.document
	document.write(htmlDocumentContent)
	vi.stubGlobal('document', document)

	return document
}
export function getPicker$Elems($picker: HTMLElement): PickerElements {
	const $currencyInput = $picker.querySelector('.picker__currency-input') as HTMLInputElement
	const $currencyName = $picker.querySelector('.picker__currency-name') as HTMLSpanElement

	const $bottomButtons = $picker.querySelectorAll('.picker__bottom-btn')
	const $button_25 = $bottomButtons[0] as HTMLButtonElement
	const $button_50 = $bottomButtons[1] as HTMLButtonElement
	const $button_75 = $bottomButtons[2] as HTMLButtonElement
	const $button_100 = $bottomButtons[3] as HTMLButtonElement

	const $buttonLines = $picker.querySelectorAll('.picker__bottom-btn-line')
	const buttonLines: HTMLElement[] = []
	for (let i = 0; i < $buttonLines.length; i++) {
		buttonLines.push($buttonLines[i] as HTMLElement)
	}

	return {
		$currencyInput,
		$currencyName,
		$button_25,
		$button_50,
		$button_75,
		$button_100,
		buttonLines,
	}
}

export function wait(ms = 50) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms)
	})
}