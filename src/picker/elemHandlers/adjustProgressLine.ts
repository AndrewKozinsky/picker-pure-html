type AdjustProgressLineConfig = {
	// Элементы полоски, которые нужно анимировать
	$segmentsArr: HTMLElement[],
	// Текущее процентное значение полоски
	currentPercent: number
	// Новое процентное значение полоски
	newPercent: number
	// Время в мс за которое анимация, должна пройти от нулевой точки, до конца
	// Если расстояние меньше, то время анимации уменьшается пропорционально
	totalTimeInMs: number
}

export function adjustProgressLine(config: AdjustProgressLineConfig) {
	// Общее количество полосок для анимации
	const segmentsTotalNum = config.$segmentsArr.length // 4
	// Сколько процентов приходится на один сегмент
	const percentsInSegment = 100 / segmentsTotalNum // 25

	const info = getStartAndEndSegmentsTotalPercents({
		percentsInSegment,
		currentPercent: config.currentPercent,
		newPercent: config.newPercent,
	})

	const animationConfig = createAnimationConfig(info, segmentsTotalNum, config.totalTimeInMs)

	for (let i = 0; i < animationConfig.length; i++) {
		const animConfig = animationConfig[i]
		const $currentSegment = config.$segmentsArr[i]

		setTimeout(() => {
			animateWidth({
				element: $currentSegment,
				duration: animConfig.animationTime,
				startWidth: animConfig.from,
				endWidth: animConfig.to
			})
		}, animConfig.delay)
	}
}

function getStartAndEndSegmentsTotalPercents(config: {
	percentsInSegment: number, // 25
	currentPercent: number, // 30
	newPercent: number, // 60
}) {
	const { percentsInSegment, currentPercent, newPercent } = config

	const startSegmentNum = Math.ceil(currentPercent / percentsInSegment) // 2
	const endSegmentNum = Math.ceil(newPercent / percentsInSegment) // 3

	// 30 - (25 * (startSegmentNum - 1))
	const startSegmentPercents = currentPercent - (percentsInSegment * (startSegmentNum - 1))

	const endSegmentPercents = startSegmentNum === endSegmentNum
		? newPercent - (percentsInSegment * (startSegmentNum - 1))
		: newPercent - ((endSegmentNum - 1) * percentsInSegment)

	return {
		startSegmentNum,
		startSegmentPercents,
		endSegmentNum,
		endSegmentPercents
	}
}

type SegmentAnimationConfig = {
	from: number
	to: number
	animationTime: number
	delay: number
}

function createAnimationConfig(
	info: {
		startSegmentNum: number
		startSegmentPercents: number
		endSegmentNum: number
		endSegmentPercents: number
	},
	segmentsNum: number,
	totalTimeInMs: number
): SegmentAnimationConfig[] {
	const {
		startSegmentNum,
		startSegmentPercents,
		endSegmentNum,
		endSegmentPercents
	} = info

	const segmentsAnimationConfig: SegmentAnimationConfig[] = []

	let delay = 0

	for (let i = 1; i <= segmentsNum; i++) {
		if (i < startSegmentNum) {
			segmentsAnimationConfig.push({
				from: 100,
				to: 100,
				animationTime: 0,
				delay: 0
			})
		} else if (i === startSegmentNum) {
			const animationTime = totalTimeInMs / 100 * ((100 / segmentsNum) - startSegmentPercents)

			segmentsAnimationConfig.push({
				from: startSegmentPercents * segmentsNum,
				to: startSegmentNum === endSegmentNum ? endSegmentPercents * segmentsNum : 100,
				animationTime,
				delay
			})

			delay += animationTime
		} else if (i > startSegmentNum && i < endSegmentNum) {
			const animationTime = totalTimeInMs / segmentsNum

			segmentsAnimationConfig.push({
				from: 0,
				to: 100,
				animationTime,
				delay
			})

			delay += animationTime
		} else if (i === endSegmentNum) {
			const animationTime = (totalTimeInMs / 100) * endSegmentPercents

			segmentsAnimationConfig.push({
				from: 0,
				to: endSegmentPercents * segmentsNum,
				animationTime,
				delay
			})

			delay += animationTime
		} else if (i > endSegmentNum) {
			segmentsAnimationConfig.push({
				from: 0,
				to: 0,
				animationTime: 0,
				delay: 0
			})
		}
	}

	return segmentsAnimationConfig
}

type AnimationOptions = {
	element: HTMLElement
	duration: number
	startWidth: number
	endWidth: number
}

function animateWidth({ element, duration, startWidth, endWidth }: AnimationOptions): void {
	const startTime = performance.now()
	const widthChange = endWidth - startWidth

	function step(currentTime: number) {
		const elapsedTime = currentTime - startTime
		const progress = Math.min(elapsedTime / duration, 1) // Progress from 0 to 1
		const currentWidth = startWidth + widthChange * progress

		element.style.width = `${currentWidth}%`

		if (progress < 1) {
			requestAnimationFrame(step)
		}
	}

	requestAnimationFrame(step)
}