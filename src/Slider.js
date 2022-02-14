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
	setError,
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

	const checkOthersZeroOrLocked = (state) => {
		let newState = [...state];

		newState.splice(index, 1);
		if (index != 0) newState.shift();
		const tempLocked = [...isLockedArray];
		tempLocked.splice(index, 1);
		if (index != 0) tempLocked.shift();

		return newState.every((slider, i) => slider === 0 || tempLocked[i]);
	};

	const checkOthersAllLocked = (state) => {
		const tempLocked = [...isLockedArray];
		tempLocked.splice(index, 1);
		if (index != 0) tempLocked.shift();

		return tempLocked.every((slider, i) => slider);
	};

	const handleOnChange = (e) => {
		// const totalCurr = slidersArray.reduce((acc, curr, i) => acc + curr, 0);

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

			const checkZeroOrLocked = checkOthersZeroOrLocked(newState);
			const checkOthersLocked = checkOthersAllLocked();

			let applyValueToFirstOnly = false;
			const totalToDistribute = Math.floor(newDiff / newState.length);
			const totalToAdjustLast =
				Math.ceil(newDiff / newState.length) - totalToDistribute;
			if (totalToDistribute === 0) {
				applyValueToFirstOnly = true;
			}

			if (checkZeroOrLocked && newDiff > 0) {
				setError("All others are zero or locked");
				setTimeout(() => {
					setError("");
				}, 3000);
				return newState;
			}

			if (checkOthersLocked) {
				setError("All others are zero or locked");
				setTimeout(() => {
					setError("");
				}, 3000);
				return newState;
			}

			console.log("VAL", val);

			newState[index] = parseInt(val);

			// add to other sliders
			if (newState.length > 1) {
				let skipAdjust = 0;

				// skip a slider
				if (
					(newState[lastAdjusted] <= 0 && newDiff < 0) ||
					isLockedArray[lastAdjusted] ||
					lastAdjusted === index
				) {
					console.log(
						"SKIPPING",
						(newState[lastAdjusted] <= 0 && newDiff < 0) ||
							isLockedArray[lastAdjusted] ||
							lastAdjusted === index
					);
					skipAdjust = 1;
					// setLastAdjusted((prev) => {
					// 	return prev === newState.length - 1 ? 1 : prev + 1;
					// });
				}

				let updatedLastAdjusted = lastAdjusted + skipAdjust;
				if (
					newState[updatedLastAdjusted] >= 0 &&
					!isLockedArray[updatedLastAdjusted]
				) {
					console.log("NEW DIFF", newDiff, updatedLastAdjusted);
					if (newDiff < -1) {
						console.log("Adjustment", newDiff, totalToDistribute);
						for (let j = 1; j < newState.length; j++) {
							console.log("Before: ", newState[j]);
							if (j === index) continue;
							newState[j] = newState[j] + Math.abs(totalToDistribute);
							console.log("After: ", newState[j]);
						}
					} else if (newDiff > 1) {
						console.log("Adjustment", newDiff, totalToDistribute);
						for (let j = 1; j < newState.length; j++) {
							console.log("Before: ", newState[j]);
							if (j === index) continue;
							newState[j] = newState[j] - totalToDistribute;
							console.log("After: ", newState[j]);
						}
					} else if (newDiff === -1) {
						newState[updatedLastAdjusted] =
							newState[updatedLastAdjusted] + Math.abs(newDiff);
					} else {
						newState[updatedLastAdjusted] =
							newState[updatedLastAdjusted] - newDiff;
					}

					if (newState[updatedLastAdjusted] < 0) {
						newState[updatedLastAdjusted] = 0;
					}
				}

				setLastAdjusted((prev) => {
					return prev === newState.length - 1 ? 1 : prev + 1;
				});
			}

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
