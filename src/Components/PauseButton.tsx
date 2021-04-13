import React from "react";

interface Props {
  isPaused: boolean;
	setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}
export function PauseButton(props: Props){
	const buttonText = props.isPaused ? "Play" : "Pause";

	return(
		<button onClick={() => props.setIsPaused(!props.isPaused)}>{buttonText}</button>
	)
}