import Decimal from 'decimal.js-light'
import {BottomButtonText, Store} from '../utils/types.ts'
import {unknownToPositiveNumber} from '../utils/utils.ts'
import {ValueHelper} from '../valueHelper.ts'

export function createSetPercentageValueHandler(store: Store, percentage: BottomButtonText, valueHelper: ValueHelper) {
	return () => {
		switch (percentage) {
			case BottomButtonText._25:
				store.value = valueHelper.get25Percent()
				break
			case BottomButtonText._50:
				store.value = valueHelper.get50Percent()
				break
			case BottomButtonText._75:
				store.value = valueHelper.get75Percent()
				break
			case BottomButtonText._100:
				store.value = valueHelper.get100Percent()
				break
		}
	}
}

export function createArrowsKeyDownValueHandler(store: Store, valueHelper: ValueHelper) {
	return (e: KeyboardEvent) => {

		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			e.preventDefault()
			store.value = valueHelper.increaseValueStep(store.value)
			return
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			e.preventDefault()
			store.value = valueHelper.decreaseValueStep(store.value)
			return
		} else if (e.key === 'e') {
			e.preventDefault()
			return
		}
	}
}

export function createInputValueHandler(store: Store, valueHelper: ValueHelper) {
	return (e: Event) => {
		// @ts-ignore
		const inputValue = e.target!.value

		if (inputValue === '') {
			return
		}

		const numberValue = unknownToPositiveNumber(inputValue)
		store.value = valueHelper.normalizeValue(new Decimal(numberValue))
	}
}
