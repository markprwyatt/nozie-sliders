import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect, useCallback } from "react";
import Slider from "react-input-slider";
import styled, { css } from "styled-components";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import { difference } from "lodash";
import { divide } from "lodash";

const SliderDiv = styled.div`
	display: flex;

	${(props) =>
		props.isStandardLayout
			? css`
					flex-direction: column;
			  `
			: css`
					align-items: center;
					position: relative;
					margin-bottom: 3rem;
			  `}

	h5 {
		${(props) =>
			props.isStandardLayout
				? css`
						margin-bottom: 6rem;
				  `
				: css`
						position: absolute;
						left: -30px;
				  `}
	}

	button:first-of-type {
		${(props) =>
			props.isStandardLayout
				? css`
						margin-top: 5rem;
				  `
				: css`
						position: absolute;
						left: -100px;
				  `}
	}

	button:nth-of-type(2) {
		${(props) =>
			props.isStandardLayout
				? css``
				: css`
						position: absolute;
						left: -230px;
				  `}
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
	hideNumbers,
	isStandardLayout,
}) {
	const SliderMap = {
		0: 100,
		1: 20,
		2: 20,
	};

	const [isLockedAt50, setIsLockedAt50] = useState(true);
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

	const calculateTotalOfNonLockedOthers = (val) => {
		const tempLocked = [...isLockedArray];
		const tempSliderValues = [...slidersArray];
		let total = 0;
		for (var i = 0; i < tempLocked.length; i++) {
			if (!tempLocked[i] && i != index) {
				total += tempSliderValues[i];
			}
		}

		return total;
	};

	const totalNumOfSlidersNotLocked = () => {
		const tempLocked = [...isLockedArray];
		tempLocked.splice(index, 1);
		if (index != 0) tempLocked.shift();

		return tempLocked.filter((slider, i) => !slider).length;
	};

	const handleOnChange = (e) => {
		// const totalCurr = slidersArray.reduce((acc, curr, i) => acc + curr, 0);

		if (isLocked) {
			return;
		}

		let val = parseInt(e.target.value);
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

			const totalWithoutNewDiff =
				newState.reduce((acc, curr, i) => (i !== index ? acc + curr : acc), 0) +
				val -
				100;

			//NewDiff - the problem here is that if you move this quickly you can create a newDiff that
			//is greater than then the total amount available (i.e. 100 - the locked total, it should be capped so
			//it doesnt go above 100.
			if (totalWithoutNewDiff > 0) {
				if (totalWithoutNewDiff > calculateTotalOfNonLockedOthers()) {
					const valToSubtract =
						totalWithoutNewDiff - calculateTotalOfNonLockedOthers();
					console.log("Subtract", valToSubtract);
					newDiff = newDiff - valToSubtract;
					val = val - valToSubtract;
				}
			}

			const checkZeroOrLocked = checkOthersZeroOrLocked(newState);
			const checkOthersLocked = checkOthersAllLocked();
			const slidersNotLocked = totalNumOfSlidersNotLocked();
			let applyValueToFirstOnly = false;
			const totalToDistribute = Math.floor(newDiff / (newState.length - 2));
			let totalToAdjustLast =
				Math.ceil(newDiff / (newState.length - 2)) - totalToDistribute;

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

			newState[index] = parseInt(val);

			// add to other sliders
			if (newState.length > 1) {
				let skipAdjust = 0;
				let updatedLastAdjusted = lastAdjusted + skipAdjust;
				// skip a slider
				// if (
				// 	(newState[lastAdjusted] <= 0 && newDiff < 0) ||
				// 	isLockedArray[lastAdjusted] ||
				// 	lastAdjusted === index
				// ) {
				// 	console.log(
				// 		newState[lastAdjusted] <= 0 && newDiff < 0,
				// 		isLockedArray[lastAdjusted],
				// 		lastAdjusted === index
				// 	);
				const directionalCheck = (difference, value) => {
					if (difference > 0) {
						return value !== 0;
					} else {
						return true;
					}
				};

				var offset = lastAdjusted;
				for (var i = 0; i < newState.length; i++) {
					var pointer = (i + offset) % newState.length;
					if (
						pointer !== index &&
						pointer !== 0 &&
						directionalCheck(newDiff, newState[pointer]) &&
						!isLockedArray[pointer]
					) {
						updatedLastAdjusted = pointer;
						break;
					}
				}
				// } else if (
				// 	(newDiff > 0 && newState[lastAdjusted] >= 100) ||
				// 	isLockedArray[lastAdjusted] ||
				// 	lastAdjusted === index
				// ) {
				// 	skipAdjust = 1;

				// 	var offset = lastAdjusted;
				// 	for (var i = 0; i < newState.length; i++) {
				// 		var pointer = (i + offset) % newState.length;
				// 		if (
				// 			pointer !== index &&
				// 			pointer !== 0 &&
				// 			(newState[pointer] !== 0 || isLockedArray[pointer])
				// 		) {
				// 			console.log(
				// 				pointer !== index,
				// 				pointer !== 0,
				// 				newState[pointer] !== 0,
				// 				isLockedArray[pointer]
				// 			);
				// 			console.log(
				// 				"POINTER: ",
				// 				pointer !== 0,
				// 				newState[pointer],
				// 				isLockedArray[pointer]
				// 			);
				// 			updatedLastAdjusted = pointer;

				// 			break;
				// 		}
				// 	}
				// }
				// looop over sliders to find next one unlocked
				// } else if (	(newState[lastAdjusted] >= 100 && newDiff > 0) ||
				// 	isLockedArray[lastAdjusted] ||
				// 	lastAdjusted === index) {

				// 	}
				// if index is last element then set to first
				let remainderToRemove = 0;
				if (
					newState[updatedLastAdjusted] >= 0 &&
					!isLockedArray[updatedLastAdjusted]
				) {
					if (newDiff === -1) {
						newState[updatedLastAdjusted] =
							newState[updatedLastAdjusted] + Math.abs(newDiff);
					} else {
						if (newState[updatedLastAdjusted] - newDiff < 0) {
							newState[updatedLastAdjusted] =
								newState[updatedLastAdjusted] - newDiff;
							remainderToRemove += Math.abs(
								newState[updatedLastAdjusted] - newDiff
							);
						} else {
							newState[updatedLastAdjusted] =
								newState[updatedLastAdjusted] - newDiff;
						}
					}

					if (newState[updatedLastAdjusted] < 0) {
						newState[updatedLastAdjusted] = 0;
					}
				}

				let loopIndex = 0;
				let loopCount = 0;
				//While the total is above 100 (only happens due to an error)
				while (
					newState.reduce((partialSum, a) => partialSum + a, 0) - 100 >
					0
				) {
					//Make sure it doesn't change the user changed slider, make sure that the value isn't already zero and make sure it's not locked.
					if (
						loopIndex !== index &&
						newState[loopIndex] > 0 &&
						!isLockedArray[loopIndex]
					) {
						newState[loopIndex] = newState[loopIndex] - 1;
					} else {
						loopIndex++;
					}
					loopCount++;
					if (loopCount === 100) break;
				}

				setLastAdjusted((prev) => {
					return prev === newState.length - 1 ? 1 : prev + 1;
				});
			}

			return newState;
		});
	};

	return (
		<SliderDiv isStandardLayout={isStandardLayout}>
			{!hideNumbers && <h5>{sliderValue}</h5>}

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
