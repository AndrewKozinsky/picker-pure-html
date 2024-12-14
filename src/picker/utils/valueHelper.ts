import Decimal from 'decimal.js-light'

type RoundNumberToStepDirection = 'floor' | 'ceil' | 'auto'

export class ValueHelper {
	constructor(
		private minValue: Decimal, private maxValue: Decimal, private step: Decimal
	) {}

	get25Percent() {
		return this.getValuePercent(0.25)
	}
	get50Percent() {
		return this.getValuePercent(0.5)
	}
	get75Percent() {
		return this.getValuePercent(0.75)
	}
	get100Percent() {
		return this.getValuePercent(1)
	}

	getValuePercent(percentage: number) {
		// (maxValue minValue) * percentage + minValue
		const newUnsafeValue = this.maxValue.minus(this.minValue).mul(percentage).plus(this.minValue)

		return this.normalizeValue(newUnsafeValue)
	}

	increaseValueStep(value: Decimal): Decimal {
		const newValue = value.plus(this.step)
		return this.normalizeValue(newValue)
	}

	decreaseValueStep(value: Decimal): Decimal {
		const newValue = value.minus(this.step)
		return this.normalizeValue(newValue)
	}

	normalizeValue(unsafeValue: Decimal): Decimal {
		if (unsafeValue.lt(this.minValue)) {
			return this.minValue
		} else if (unsafeValue.gt(this.maxValue)) {
			return this.maxValue
		}

		return ValueHelper.roundNumberToStep(unsafeValue, this.step)
	}

	/**
	 * Делает переданное число кратное шагу
	 * Если пришло 12, а шаг 5, то вернёт 10 или 15 в зависимости от направления округления.
	 * @param unsafeNum — значение, которое должно быть кратно шагу
	 * @param step — значение шага
	 * @param direction — в какую сторону округлять значение
	 */
	static roundNumberToStep(unsafeNum: Decimal, step: Decimal, direction: RoundNumberToStepDirection = 'auto'): Decimal {
		// Если делится без остатка, то минимальное число кратно шагу
		// Аналог unsafeNum % step === 0
		if (unsafeNum.dividedBy(step).isint()) {
			return unsafeNum
		}

		// В противном случае получу число кратное шагу.
		// Округление в большую или меньшую сторону в зависимости от направления
		const stepMultipliers: Record<RoundNumberToStepDirection, Decimal> = {
			floor: unsafeNum.div(step).toInteger(), // Аналог Math.floor(12 / 5) => 2
			auto: unsafeNum.div(step).toInteger(), // Аналог Math.round(12 / 5) => 2
			ceil: unsafeNum.div(step).toInteger().plus(1), // Аналог Math.ceil(12 / 5) => 3
		}

		// Увеличу шаг на полученный множитель
		// 3 * 5 => 15
		return stepMultipliers[direction].mul(step)
	}
}