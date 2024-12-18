import Decimal from 'decimal.js-light'
import {adjustProgressLine} from '../elemHandlers/adjustProgressLine.ts'
import {ValueHelper} from './valueHelper.ts'
import {PickerConfig, PickerElements, PickerUnsafeConfig, Store} from './types.ts'
import {unknownToPositiveNumber, unknownToString} from './utils.ts'

export function fixPickerConfig(pickerUnsafeConfig: PickerUnsafeConfig): PickerConfig {
	const step = unknownToPositiveNumber(pickerUnsafeConfig.step, 1)
	const decStep = new Decimal(step)

	let minValue = unknownToPositiveNumber(pickerUnsafeConfig.minValue)
	let decMinValue = new Decimal(minValue)
	decMinValue = ValueHelper.roundNumberToStep(decMinValue, decStep, 'ceil')

	let maxValue = unknownToPositiveNumber(pickerUnsafeConfig.maxValue)
	let decMaxValue = new Decimal(maxValue)
	decMaxValue = ValueHelper.roundNumberToStep(decMaxValue, decStep, 'floor')

	let initialValue = unknownToPositiveNumber(pickerUnsafeConfig.initialValue)
	let decInitialValue = new Decimal(initialValue)
	decInitialValue = ValueHelper.roundNumberToStep(decInitialValue, decStep)
	if (decInitialValue.lt(decMinValue)) {
		decInitialValue = decMinValue
	} else if (decInitialValue.gt(decMaxValue)) {
		decInitialValue = decMaxValue
	}

	const currency = unknownToString(pickerUnsafeConfig.currency).toLocaleUpperCase()

	return {
		minValue: decMinValue,
		maxValue: decMaxValue,
		step: decStep,
		initialValue: decInitialValue,
		currency
	}
}

export function createPickerStore(pickerConfig: PickerConfig, pickerElems: PickerElements, valueHelper: ValueHelper): Store {
	const storeObj: Store = {
		minValue: pickerConfig.minValue,
		maxValue: pickerConfig.maxValue,
		step: pickerConfig.step,
		value: pickerConfig.initialValue,
		currency: pickerConfig.currency,
	}

	let oldPercentValue = getPercentFromNum(pickerConfig, pickerConfig.initialValue)

	return new Proxy(storeObj, {
		set(target, prop, val) { // для перехвата записи свойства
			if (prop == 'value') {
				const normalizedValue = valueHelper.normalizeValue(val)
				target[prop] = normalizedValue

				pickerElems.$currencyInput.value = normalizedValue.toString()

				const percentValue = getPercentFromNum(pickerConfig, normalizedValue)

				adjustProgressLine({
					$segmentsArr: pickerElems.buttonLines,
					currentPercent: +oldPercentValue.toString(),
					newPercent: +(percentValue).toString(),
					totalTimeInMs: 200
				})

				oldPercentValue = percentValue
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


export function getPercentFromNum(pickerConfig: PickerConfig, current: Decimal): Decimal {
	const total = pickerConfig.maxValue.minus(pickerConfig.minValue)
	const cur = current.minus(pickerConfig.minValue)

	return cur.dividedBy(total).mul(100)
}