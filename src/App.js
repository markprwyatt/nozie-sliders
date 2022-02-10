import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Slider from "./Slider";
import SliderButton from "./SliderButton";
import styled from "styled-components";

const SliderContainer = styled.div`
	display: flex;
	height: 500px;
	padding-top: 100px;

	input {
		display: block;
		transform: rotate(270deg);
	}
`;

function App() {
	const [total, setTotal] = useState(100);
	const [error, setError] = useState("");
	const [lastAdjusted, setLastAdjusted] = useState(1);
	const [sliderValue, setSliderValue] = useState([100]);
	const [lockedSliders, setLockedSliders] = useState([true]);

	useEffect(() => {
		const newTotal = sliderValue.reduce((acc, curr, i) => acc + curr, 0);
		setTotal(newTotal);
	}, [sliderValue]);

	useEffect(() => {
		if (sliderValue.length > 4) {
			setError("This many blends may get funky");
			setTimeout(() => {
				setError("");
			}, 5000);
		}
	}, [sliderValue.length]);

	return (
		<div className="App">
			<header className="App-header">
				<div>
					<SliderButton
						text="Remove Button"
						setError={setError}
						setSliderCount={setSliderValue}
						sliderCount={sliderValue.length}
						sliderValue={sliderValue}
						total={total}
						setTotal={setTotal}
						setLockedSliders={setLockedSliders}
					/>
					<h1>Nozie Sliders</h1>
					<h2> {total}</h2>
					<p>{error}</p>
					<SliderButton
						text="Add Button"
						setError={setError}
						setSliderCount={setSliderValue}
						sliderCount={sliderValue.length}
						isIncrement
						sliderValue={sliderValue}
						total={total}
						setTotal={setTotal}
						setLockedSliders={setLockedSliders}
					/>
				</div>
				<SliderContainer>
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
						/>
					))}
				</SliderContainer>
			</header>
		</div>
	);
}

export default App;
