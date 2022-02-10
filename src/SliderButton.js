import React from "react";

const SliderButton = ({
	setError,
	setSliderCount,
	sliderCount,
	text,
	isIncrement,
	sliderValue,
	setTotal,
	setLockedSliders,
}) => {
	const setNewSliderValue = () => {
		const valueMap = {
			0: 100,
			1: 20,
			2: 20,
		};

		if (sliderCount <= 2) {
			return valueMap[sliderCount];
		}

		const foundationBlend = 50;

		const totalWithoutFoundation = sliderValue.reduce((acc, curr, i) => {
			return acc + (i === 0 ? 0 : curr);
		}, 0);

		// const totalToDistribute = Math.floor(totalWithoutFoundation / sliderCount);
		// const totalToAddToFoundation = totalWithoutFoundation % sliderCount;
		const totalToDistribute = Math.floor(foundationBlend / sliderCount);
		const totalToAddToFoundation = foundationBlend % sliderCount;

		setSliderCount((state) => {
			return [
				...state.map((slider, i) => {
					if (i === 0) return foundationBlend + totalToAddToFoundation;

					return totalToDistribute;
				}),
			];
		});

		return 10;
	};

	const onAddSlider = () => {
		if (sliderCount <= 2) {
			const tempValue = sliderValue;
			tempValue[0] = tempValue[0] - setNewSliderValue();
			const newState = [...tempValue, setNewSliderValue()];
			setSliderCount(newState);
			return;
		}

		setSliderCount((state) =>
			isIncrement ? [...state, 0] : [...state.slice(0, state.length - 1)]
		);
		setNewSliderValue();
		setLockedSliders((state) => [...state, false]);
	};

	const onRemoveSlider = () => {
		if (sliderCount <= 2) {
		}
		let sliderToRemove = sliderValue[sliderValue.length - 1];
		setSliderCount((state) =>
			isIncrement
				? [...state, setNewSliderValue()]
				: [...state.slice(0, state.length - 1)]
		);
		setTotal((state) => state - sliderToRemove);
	};
	return (
		<button
			onClick={() => {
				if (isIncrement ? sliderCount === 20 : sliderCount === 1) {
					isIncrement
						? setError("Maximum 20 blends")
						: setError("Minimum 1 blends");
					setTimeout(() => setError(""), 5000);
				} else {
					isIncrement ? onAddSlider() : onRemoveSlider();
				}
			}}
		>
			{text}
		</button>
	);
};

//const indexToRemove = 2; // the 'c'

//const result = [...arr.slice(0, indexToRemove), ...arr.slice(indexToRemove + 1)];

export default SliderButton;
