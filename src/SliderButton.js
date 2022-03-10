import React from "react";

const SliderButton = ({
	setError,
	sliderCount,
	text,
	isIncrement,
	sliderValue,
	setTotal,
	setLockedSliders,
	setLastAdjusted,
	setSliderValue,
	isLockedArray,
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

		setSliderValue((state) => {
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
			setSliderValue(newState);
			setLockedSliders((state) => [...state, false]);
			setLastAdjusted(1);
			return;
		}

		setSliderValue((state) =>
			isIncrement ? [...state, 0] : [...state.slice(0, state.length - 1)]
		);
		setNewSliderValue();
		setLockedSliders((state) => [...state, false]);
		setLastAdjusted(1);
	};

	const onRemoveSlider = () => {
		let sliderToRemove = sliderValue[sliderValue.length - 1];
		console.log(sliderToRemove);
		setSliderValue((state) => {
			let loopIndex = 0;
			let newState = [...state.slice(0, state.length - 1)];
			//While the total is above 100 (only happens due to an error)
			while (sliderToRemove > 0) {
				if (isLockedArray.every((slider) => slider)) {
					break;
				}

				//Make sure it doesn't change the user changed slider, make sure that the value isn't already zero and make sure it's not locked.
				if (newState[loopIndex] > 0 && !isLockedArray[loopIndex]) {
					newState[loopIndex] = newState[loopIndex] + 1;
					sliderToRemove -= 1;
					console.log("adding", newState[loopIndex], sliderToRemove);
					loopIndex++;
					if (loopIndex > newState.length - 1) {
						loopIndex = 0;
					}
				} else {
					loopIndex++;
					if (loopIndex > newState.length - 1) {
						loopIndex = 0;
					}
				}
			}
			console.warn(newState);
			return newState;
		});

		// setSliderValue((state) => [...state.slice(0, state.length - 1)]);
		// setTotal((state) => state - sliderToRemove);
		setLastAdjusted(1);
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
