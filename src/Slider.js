import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Slider from "react-input-slider";
import styled from "styled-components";

const SliderDiv = styled.div`
	display: flex;
	flex-direction: column;

	h5 {
		margin-bottom: 6rem;
	}

	button {
		margin-top: 5rem;
	}
`;
function NozieSlider({
	setTotal,
	index,
	total,
	sliderCount,
	sliderValue,
	setSliderValue,
	slidersArray,
	lastAdjusted,
	setLastAdjusted,
	isLocked,
	isLockedArray,
	setLockedSliders,
}) {
	const SliderMap = {
		0: 100,
		1: 20,
		2: 20,
	};

	const [isLockedAt50, setIsLockedAt50] = useState(true);
	useEffect(() => {
		// if (sliderCount === 1 && index === 0) {
		// 	setSliderValue(100);
		// } else if (sliderCount === 2) {
		// 	if (index === 0) {
		// 		setSliderValue(80);
		// 	}
		// 	if (index === 1) {
		// 		setSliderValue(20);
		// 	}
		// } else if (sliderCount === 3) {
		// 	if (index === 0) {
		// 		setSliderValue(60);
		// 	}
		// 	if (index === 1) {
		// 		setSliderValue(20);
		// 	}
		// 	if (index === 2) {
		// 		setSliderValue(20);
		// 	}
		// }
	}, [sliderCount]);

	const handleOnChange = (e) => {
		// const totalCurr = slidersArray.reduce((acc, curr, i) => acc + curr, 0);

		const currentSliderValue = sliderValue;

		if (isLocked) {
			return;
		}

		const val = parseInt(e.target.value);
		const id = e.target.id;

		if (id === "foundation" && val < 50 && isLockedAt50) {
			return;
		}

		// if (currentSliderValue != val) {
		// 	if (currentSliderValue < val) {
		// 		setTotal((state) => {
		// 			let diff = state - currentSliderValue;
		// 			if (diff + val > 100) return state;
		// 			return diff + val;
		// 		});
		// 	} else {
		// 		setTotal((state) => {
		// 			let diff = state - currentSliderValue;
		// 			if (diff + val > 100) return state;
		// 			return diff + val;
		// 		});
		// 	}
		// }
		// if (total >= 100) {
		// 	return;
		// }

		setSliderValue((state) => {
			let newState = [...state];
			let newDiff = val - newState[index];
			let applyValueToFirstOnly = false;
			const totalToDistribute = Math.floor(newDiff / newState.length);
			const totalToAdjustLast =
				Math.ceil(newDiff / newState.length) - totalToDistribute;
			if (totalToDistribute === 0) {
				applyValueToFirstOnly = true;
			}

			console.log("VAL", val);
			newState[index] = parseInt(val);
			if (newState.length > 1) {
				let skipAdjust = false;
				console.log("LAST ADJUSTED", newState[lastAdjusted]);

				// skip a slider
				if (newState[lastAdjusted] <= 0 || isLocked) {
					skipAdjust = true;
					setLastAdjusted((prev) =>
						lastAdjusted === newState.length - 1 ? 1 : prev + 1
					);
				}
				if (newState[lastAdjusted] >= 0 && !isLockedArray[lastAdjusted]) {
					if (newDiff < 0) {
						newState[lastAdjusted] = newState[lastAdjusted] + Math.abs(newDiff);
					} else {
						newState[lastAdjusted] = newState[lastAdjusted] - newDiff;
					}

					if (newState[lastAdjusted] < 0) {
						newState[lastAdjusted] = 0;
					}
				}
				if (!skipAdjust) {
					setLastAdjusted((prev) =>
						lastAdjusted === newState.length - 1 ? 1 : prev + 1
					);
				}
			}

			// newState = newState.map((slider, i) => {
			// 	if (i === 0) return slider;
			// 	if (i === newState.length - 1) {
			// 		return newDiff > 0
			// 			? parseInt(slider - totalToAdjustLast)
			// 			: parseInt(slider + totalToAdjustLast);
			// 	} else {
			// 		if (applyValueToFirstOnly) {
			// 			if (i === 1) {
			// 				return newDiff > 0
			// 					? parseInt(slider + totalToAdjustLast)
			// 					: parseInt(slider - totalToAdjustLast);
			// 			} else {
			// 				return slider;
			// 			}
			// 		} else {
			// 			return newDiff > 0
			// 				? parseInt(slider + totalToDistribute)
			// 				: parseInt(slider - totalToDistribute);
			// 		}
			// 	}
			// });

			return newState;
		});
	};

	return (
		<SliderDiv>
			<h5>{sliderValue}</h5>

			<input
				type="range"
				id={index === 0 ? "foundation" : "subsequent"}
				name={index === 0 ? "foundation" : "subsequent"}
				min="0"
				max="100"
				value={sliderValue}
				onInput={(e) => {
					handleOnChange(e);
				}}
				step="1"
			/>
			<button
				onClick={() =>
					setLockedSliders((state) => {
						const newState = [...state];
						newState[index] = !isLocked;
						return newState;
					})
				}
			>
				{isLocked ? "Unlock" : "Lock"}
			</button>
			{index === 0 && (
				<button onClick={() => setIsLockedAt50(!isLockedAt50)}>
					{isLockedAt50 ? "Unlock from 50" : "Lock from 50"}
				</button>
			)}
		</SliderDiv>
	);
}

export default NozieSlider;
