import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import SliderButton from "./SliderButton";
import styled, { css } from "styled-components";

const SliderContainer = styled.div`
	display: flex;

	padding-top: 100px;
	${(props) =>
		!props.isStandardLayout
			? css`
					flex-direction: column;
			  `
			: css`
					height: 500px;
			  `}

	input {
		display: block;
		${(props) =>
			props.isStandardLayout &&
			css`
				transform: rotate(270deg);
			`}
	}
`;

const ButtonHolder = styled.div`
	display: flex;
`;

function App() {
	const [total, setTotal] = useState(100);
	const [isStandardLayout, setIsStandardLayout] = useState(true);
	const [error, setError] = useState("");
	const [lastAdjusted, setLastAdjusted] = useState(1);
	const [sliderValue, setSliderValue] = useState([100]);
	const [lockedSliders, setLockedSliders] = useState([true]);
	const [hideNumbers, setHideNumbers] = useState(false);

	useEffect(() => {
		const newTotal = sliderValue.reduce((acc, curr, i) => acc + curr, 0);
		setTotal(newTotal);
	}, [sliderValue]);

	// useEffect(() => {
	// 	if (sliderValue.length > 4) {
	// 		setError("This many blends may get funky");
	// 		setTimeout(() => {
	// 			setError("");
	// 		}, 5000);
	// 	}
	// }, [sliderValue.length]);

	return (
		<div className={`App  ${!isStandardLayout ? "horizontal-layout" : ""}`}>
			<header className="App-header">
				<div>
					<SliderButton
						text="Remove Button"
						setError={setError}
						setSliderValue={setSliderValue}
						sliderCount={sliderValue.length}
						sliderValue={sliderValue}
						total={total}
						setTotal={setTotal}
						setLockedSliders={setLockedSliders}
						setLastAdjusted={setLastAdjusted}
						isLockedArray={lockedSliders}
					/>
					<h1>Nozie Sliders</h1>
					{!hideNumbers && <h2> {total}</h2>}

					<SliderButton
						text="Add Button"
						setError={setError}
						setSliderValue={setSliderValue}
						sliderCount={sliderValue.length}
						isIncrement
						sliderValue={sliderValue}
						total={total}
						setTotal={setTotal}
						setLockedSliders={setLockedSliders}
						setLastAdjusted={setLastAdjusted}
						isLockedArray={lockedSliders}
					/>
				</div>
				<SliderContainer isStandardLayout={isStandardLayout}>
					{sliderValue.map((slider, i) => (
						<Slider
							key={i}
							total={total}
							setTotal={setTotal}
							index={i}
							sliderCount={sliderValue.length}
							sliderValue={slider}
							setSliderValue={setSliderValue}
							slidersArray={sliderValue}
							setLastAdjusted={setLastAdjusted}
							lastAdjusted={lastAdjusted}
							setLockedSliders={setLockedSliders}
							isLocked={lockedSliders[i]}
							isLockedArray={lockedSliders}
							setError={setError}
							hideNumbers={hideNumbers}
							isStandardLayout={isStandardLayout}
						/>
					))}
				</SliderContainer>
				<p> Message : {error}</p>
				{sliderValue.length > 4 && <p>This many blends may get funky</p>}
				<ButtonHolder>
					<button onClick={() => setHideNumbers(!hideNumbers)}>
						{hideNumbers ? "Show Numbers" : "Hide Numbers"}
					</button>
					<button onClick={() => setIsStandardLayout(!isStandardLayout)}>
						Change Layout
					</button>
				</ButtonHolder>
			</header>
		</div>
	);
}

export default App;
