import {ValueHelper} from '../valueHelper.ts'
import {PickerConfig, PickerElements, PickerUnsafeConfig, Store} from './types.ts'
import {unknownToNumber, unknownToString} from './utils.ts'

export function createPickerStore(pickerConfig: PickerConfig, pickerElems: PickerElements, valueHelper: ValueHelper): Store {
	const storeObj: Store = {
		minValue: pickerConfig.minValue,
		maxValue: pickerConfig.maxValue,
		step: pickerConfig.step,
		value: pickerConfig.initialValue,
		currency: pickerConfig.currency,
	}

	return new Proxy(storeObj, {
		set(target, prop, val) { // для перехвата записи свойства
			if (prop == 'value') {
				const normalizedValue = valueHelper.normalizeValue(val)
				target[prop] = normalizedValue

				pickerElems.$currencyInput.value = normalizedValue.toString()
			} else {
				// @ts-ignore
				target[prop] = val
			}

			return true
		},
		get(target, prop) {
			if (prop in target) {
				// @ts-ignore
				return target[prop]
			} else {
				return 0; // значение по умолчанию
			}
		}
	})
}

export function fixPickerConfig(pickerUnsafeConfig: PickerUnsafeConfig): PickerConfig {
	const step = unknownToNumber(pickerUnsafeConfig.step, 1)

	let minValue = unknownToNumber(pickerUnsafeConfig.minValue)
	minValue = ValueHelper.roundNumberToStep(minValue, step)

	let maxValue = unknownToNumber(pickerUnsafeConfig.maxValue)
	maxValue = ValueHelper.roundNumberToStep(maxValue, step)

	const initialValue = unknownToNumber(pickerUnsafeConfig.initialValue)
	const currency = unknownToString(pickerUnsafeConfig.currency).toLocaleUpperCase()


	return {
		minValue,
		maxValue,
		step,
		initialValue,
		currency
	}
}