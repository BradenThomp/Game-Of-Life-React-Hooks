import React from "react";
import '../index.css';

interface Props {
  isToggled: boolean;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
  toggledOnText: string;
  toggledOffText: string;
}

export function ToggleButton(props: Props){
	const buttonText = props.isToggled ? props.toggledOnText : props.toggledOffText;

	return(
		<button className="toggleButton" onClick={() => props.setIsToggled(!props.isToggled)}>{buttonText}</button>
	)
}