import {createPicker} from './picker/createPicker.ts'
import './style.css'
import './picker/css/picker.css'

const $pickerContainer = document.querySelector<HTMLDivElement>('#app')!
createPicker($pickerContainer, {
	minValue: 1,
	maxValue: 1.7,
	step: 0.2,
	initialValue: 1,
	currency: 'usdt'
})

/*setTimeout(() => {
	createPicker($pickerContainer, {minValue: 4, maxValue: 20, initialValue: 1, step: 0.5, currency: 'rur'})
}, 1000)*/
