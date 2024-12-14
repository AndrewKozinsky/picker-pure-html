type RoundNumberToStepDirection = 'floor' | 'ceil' | 'auto'

export class ValueHelper {
	constructor(
		private minValue: number, private maxValue: number, private step: number
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
		const newUnsafeValue = (this.maxValue - this.minValue) * percentage + this.minValue

		return this.normalizeValue(newUnsafeValue)
	}

	increaseValueStep(value: number): number {
		const newValue = value + this.step
		return this.normalizeValue(newValue)
	}

	decreaseValueStep(value: number): number {
		const newValue = value - this.step
		return this.normalizeValue(newValue)
	}

	normalizeValue(unsafeValue: number): number {
		if (unsafeValue < this.minValue) {
			return this.minValue
		} else if (unsafeValue > this.maxValue) {
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
	static roundNumberToStep(unsafeNum: number, step: number, direction: RoundNumberToStepDirection = 'auto'): number {
		// Если делится без остатка, то минимальное число кратно шагу
		if (unsafeNum % step === 0) {
			return unsafeNum
		}

		// В противном случае получу более число кратное шагу
		// Округление в большую или меньшую сторону в зависимости от направления
		const stepMultipliers: Record<RoundNumberToStepDirection, number> = {
			auto: Math.round(unsafeNum / step), // Math.round(12 / 5) => 2
			floor: Math.floor(unsafeNum / step), // Math.floor(12 / 5) => 2
			ceil: Math.ceil(unsafeNum / step), // Math.ceil(12 / 5) => 3
		}

		// Увеличу шаг на полученный множитель
		// 3 * 5 => 15
		return stepMultipliers[direction] * unsafeNum
	}
}