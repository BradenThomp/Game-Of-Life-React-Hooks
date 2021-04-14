import React from "react";

const style = {
  position: 'absolute',
  top: '20px',
  left: '20px'
} as React.CSSProperties

interface Props {
  isPaused: boolean;
	setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PauseButton(props: Props){
	const buttonText = props.isPaused ? "Play" : "Pause";

	return(
		<button style={style} onClick={() => props.setIsPaused(!props.isPaused)}>{buttonText}</button>
	)
}