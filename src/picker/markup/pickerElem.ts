import {BottomButtonText, PickerElements} from '../utils/types.ts'

export function create$PickerElem() {
	const elemServiceWrapper = document.createElement('div')

	elemServiceWrapper.innerHTML = `
		<section class="picker">
      <div class="picker__top-part">
        <label for="picker__currency-input" class="picker__label">
          <input
                  id="picker__currency-input"
                  type="number"
                  class="picker__currency-input"
                  placeholder="0.00"
          />
          <span class="picker__currency-name">USDT</span>
        </label>
      </div>
      <div class="picker__middle-divider"></div>
      <div class="picker__bottom-part">
        <button class="picker__bottom-btn">${BottomButtonText._25}</button>
        <button class="picker__bottom-btn">${BottomButtonText._50}</button>
        <button class="picker__bottom-btn">${BottomButtonText._75}</button>
        <button class="picker__bottom-btn">${BottomButtonText._100}</button>
      </div>
    </section>
	`

	return elemServiceWrapper.children[0] as HTMLElement
}

export function getPicker$Elems($picker: HTMLElement): PickerElements {
	const $currencyInput = $picker.querySelector('.picker__currency-input') as HTMLInputElement
	const $currencyName = $picker.querySelector('.picker__currency-name') as HTMLSpanElement

	const $bottomButtons = $picker.querySelectorAll('.picker__bottom-btn')
	const $button_25 = $bottomButtons[0] as HTMLButtonElement
	const $button_50 = $bottomButtons[1] as HTMLButtonElement
	const $button_75 = $bottomButtons[2] as HTMLButtonElement
	const $button_100 = $bottomButtons[3] as HTMLButtonElement

	return {
		$currencyInput,
		$currencyName,
		$button_25,
		$button_50,
		$button_75,
		$button_100,
	}
}