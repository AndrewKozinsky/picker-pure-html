import {expect, it} from 'vitest'
import { fireEvent } from '@testing-library/dom'
import {createPicker} from '../createPicker.ts'
import {get$picker, get$pickerContainer, getPicker$Elems, wait} from './testUtils.ts'

const $pickerContainer = get$pickerContainer()

it('Проверка наличия необходимых элементов', () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.2,
		initialValue: 2,
		currency: 'usdt'
	})

	const $picker = get$picker($pickerContainer)
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput).not.toBeNull()

	expect(picker$Elems.$currencyName).not.toBeNull()
	expect(picker$Elems.$currencyName.textContent).toBe('USDT')

	expect(picker$Elems.$button_25).not.toBeNull()
	expect(picker$Elems.$button_25.textContent).toBe('25%')

	expect(picker$Elems.$button_50).not.toBeNull()
	expect(picker$Elems.$button_50.textContent).toBe('50%')

	expect(picker$Elems.$button_75).not.toBeNull()
	expect(picker$Elems.$button_75.textContent).toBe('75%')

	expect(picker$Elems.$button_100).not.toBeNull()
	expect(picker$Elems.$button_100.textContent).toBe('100%')
})

it('Если начальное значение меньше минимального, то начальное значение приравнивается к минимальному', () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.2,
		initialValue: 1.3,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput.value).toBe('2')
})

it('Если начальное значение больше минимального, то начальное значение приравнивается к максимальному', () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.2,
		initialValue: 7.3,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput.value).toBe('5')
})

it('Если начальное значение не соответствует шагу, то округляется до соответствия', () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.5,
		initialValue: 3.3,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput.value).toBe('3.5')
})

it('Если минимальное значение не соответствует шагу, то округляется до соответствия в большую сторону', async () => {
	createPicker($pickerContainer, {
		minValue: 2.1,
		maxValue: 5,
		step: 0.5,
		initialValue: 1,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput.value).toBe('2.5')
})

it('Если максимальное значение не соответствует шагу, то округляется до соответствия в меньшую сторону', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5.1,
		step: 0.5,
		initialValue: 10,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	expect(picker$Elems.$currencyInput.value).toBe('5')
})

it('Если в поле ввода числа вписать правильное значение, то будет применено', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.5,
		initialValue: 2,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Вписать значение, чтобы увидеть что в итоге поставится
	fireEvent.input(picker$Elems.$currencyInput, {target: {value: '3.5'}})

	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('3.5')
})

it('Если в поле ввода числа вписать значение ниже минимального, то будет применено минимальное', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.5,
		initialValue: 2,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Вписать значение, чтобы увидеть что в итоге поставится
	fireEvent.input(picker$Elems.$currencyInput, {target: {value: '1'}})

	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('2')
})

it('Если в поле ввода числа вписать значение выше максимального, то будет применено максимальное', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.5,
		initialValue: 2,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Вписать значение, чтобы увидеть что в итоге поставится
	fireEvent.input(picker$Elems.$currencyInput, {target: {value: '10'}})

	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('5')
})

it('Если в поле ввода числа вписать значение не соответсвующее шагу, то итоговое значение округлится для соответствия', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.5,
		initialValue: 2,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Вписать значение, чтобы увидеть что в итоге поставится
	fireEvent.input(picker$Elems.$currencyInput, {target: {value: '2.3'}})

	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('2.5')
})

it('Проверка нажатия клавиш-стрелок', async () => {
	createPicker($pickerContainer, {
		minValue: 2,
		maxValue: 5,
		step: 0.2,
		initialValue: 3,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Нажать на кнопку-клавишу «вверх» и проверить получившееся значение
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowUp', code: 'ArrowUp' })
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('3.2')

	// На кнопку-клавишу «вправо» ...
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowRight', code: 'ArrowRight' })
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('3.4')

	// На кнопку-клавишу «вправо» ...
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowDown', code: 'ArrowDown' })
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('3.2')
})

it('При нажатии на клавиши-стрелки значение не заходит за заданные ограничения', async () => {
	createPicker($pickerContainer, {
		minValue: 1,
		maxValue: 1.4,
		step: 0.2,
		initialValue: 1,
		currency: 'usdt'
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Нажать на кнопку-клавишу «вверх» несколько раз и проверить полученное значение
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowUp', code: 'ArrowUp' }) // 1.2
	await wait()
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowUp', code: 'ArrowUp' }) // 1.4
	await wait()
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowUp', code: 'ArrowUp' }) // 1.4
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('1.4')

	// Нажать на кнопку-клавишу «вниз»...
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowDown', code: 'ArrowDown' }) // 1.2
	await wait()
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowDown', code: 'ArrowDown' }) // 1
	await wait()
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowDown', code: 'ArrowDown' }) // 1
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('1')
})

it('Проверка работы кнопок задающих процентное значение', async () => {
	createPicker($pickerContainer, {
		minValue: 1,
		maxValue: 1.6,
		step: 0.2,
		initialValue: 1,
		currency: 'usdt'
	})

	const _25percents = getPercentageValue(.25)
	const _50percents = getPercentageValue(.5)
	const _75percents = getPercentageValue(.75)
	const _100percents = getPercentageValue(1)

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Нажать на кнопку 25%
	fireEvent.click(picker$Elems.$button_25)
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe(_25percents)

	// Нажать на кнопку 50%
	fireEvent.click(picker$Elems.$button_50)
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe(_50percents)

	// Нажать на кнопку 75%
	fireEvent.click(picker$Elems.$button_75)
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe(_75percents)

	// Нажать на кнопку 100%
	fireEvent.click(picker$Elems.$button_100)
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe(_100percents)

	function getPercentageValue(percents: number) {
		const unsafeVal = 1 + (0.6 * percents)
		return roundToStep(unsafeVal, 0.2).toFixed(1).toString()
	}

	function roundToStep(value: number, step: number) {
		return Math.round(value / step) * step
	}
})

it('Если передали неправильные данные, то выборщик отрисовывается без ошибок, но в значении «0» и поле не реагирует на изменения', async () => {
	createPicker($pickerContainer, {
		minValue: undefined,
		maxValue: undefined,
		step: undefined,
		initialValue: undefined,
		currency: undefined
	})

	const $picker = $pickerContainer.querySelector('.picker')
	const picker$Elems = getPicker$Elems($picker)

	// Проверка элементов
	expect(picker$Elems.$currencyInput).not.toBeNull()
	expect(picker$Elems.$currencyInput.value).toBe('0')

	expect(picker$Elems.$currencyName).not.toBeNull()
	expect(picker$Elems.$currencyName.textContent).toBe('')

	expect(picker$Elems.$button_25).not.toBeNull()
	expect(picker$Elems.$button_25.textContent).toBe('25%')

	expect(picker$Elems.$button_50).not.toBeNull()
	expect(picker$Elems.$button_50.textContent).toBe('50%')

	expect(picker$Elems.$button_75).not.toBeNull()
	expect(picker$Elems.$button_75.textContent).toBe('75%')

	expect(picker$Elems.$button_100).not.toBeNull()
	expect(picker$Elems.$button_100.textContent).toBe('100%')

	// Вписать значение, чтобы убедить, что не изменилось
	fireEvent.input(picker$Elems.$currencyInput, {target: {value: '1'}})
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('0')

	// Нажать на кнопку-клавишу «вверх», чтобы убедить, что не изменилось
	fireEvent.keyDown(picker$Elems.$currencyInput, { key: 'ArrowUp', code: 'ArrowUp' })
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('0')

	// Нажать на кнопку 25%, чтобы убедить, что не изменилось
	fireEvent.click(picker$Elems.$button_25)
	await wait()
	expect(picker$Elems.$currencyInput.value).toBe('0')
})

// TODO Добавь тест последовательного вызова createPicker() для проверки не отрисовывается ли компонет дважды и поменялись ли значения.