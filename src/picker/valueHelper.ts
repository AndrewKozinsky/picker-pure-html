export class ValueHelper {
	constructor(private minValue: number, private maxValue: number, private step: number) {}

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

	normalizeValue(unsafeValue: number): number {
		if (unsafeValue < this.minValue) {
			return this.minValue
		} else if (unsafeValue > this.maxValue) {
			return this.maxValue
		}

		return ValueHelper.roundNumberToStep(unsafeValue, this.step)
	}

	increaseValueStep(value: number): number {
		const newValue = value + this.step
		return this.normalizeValue(newValue)
	}

	decreaseValueStep(value: number): number {
		const newValue = value - this.step
		return this.normalizeValue(newValue)
	}

	static roundNumberToStep(num: number, step: number): number {
		const remainderFromDivision = num % step

		return remainderFromDivision === 0
			? num
			: num - remainderFromDivision
	}
}