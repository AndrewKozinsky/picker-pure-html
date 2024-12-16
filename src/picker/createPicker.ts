import {adjustProgressLine} from './elemHandlers/adjustProgressLine.ts'
import {
	createSetPercentageValueHandler, createArrowsKeyDownValueHandler, createInputValueHandler
} from './elemHandlers/setPercentageValueHandler.ts'
import {createPickerStore, fixPickerConfig} from './utils/configAndStore.ts'
import {create$PickerElem, getPicker$Elems} from './markup/pickerElem.ts'
import {BottomButtonText, PickerUnsafeConfig} from './utils/types.ts'
import {ValueHelper} from './utils/valueHelper.ts'

export function createPicker($pickerContainer: HTMLElement, pickerUnsafeConfig: PickerUnsafeConfig) {
	let $picker = $pickerContainer.querySelector('.picker') as HTMLElement

	if (!$picker) {
		$picker = create$PickerElem()
		$pickerContainer.appendChild($picker)
	}

	const picker$Elems = getPicker$Elems($picker)

	const pickerConfig = fixPickerConfig(pickerUnsafeConfig)
	const valueHelper = new ValueHelper(pickerConfig.minValue, pickerConfig.maxValue, pickerConfig.step)

	const store = createPickerStore(pickerConfig, picker$Elems, valueHelper)

	picker$Elems.$currencyInput.value = store.value.toString()
	picker$Elems.$currencyName.innerText = store.currency.toString()

	picker$Elems.$button_25.onclick = createSetPercentageValueHandler(store, BottomButtonText._25, valueHelper)
	picker$Elems.$button_50.onclick = createSetPercentageValueHandler(store, BottomButtonText._50, valueHelper)
	picker$Elems.$button_75.onclick = createSetPercentageValueHandler(store, BottomButtonText._75, valueHelper)
	picker$Elems.$button_100.onclick = createSetPercentageValueHandler(store, BottomButtonText._100, valueHelper)

	adjustProgressLine({
		$segmentsArr: picker$Elems.buttonLines,
		currentPercent: 80,
		newPercent: 5,
		totalTimeInMs: 1000
	})

	picker$Elems.$currencyInput.onkeydown = createArrowsKeyDownValueHandler(store, valueHelper)
	picker$Elems.$currencyInput.oninput = createInputValueHandler(store, valueHelper)
}
