import React from "react";
import { Slider } from "./Slider";
import { ToggleButton } from "./ToggleButton";

interface Props {
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawMode: boolean;
  setIsDrawMode: React.Dispatch<React.SetStateAction<boolean>>;
  maxTickRate: number;
  minTickRate: number;
  currentTickRate: number;
  setCurrentTickRate: React.Dispatch<React.SetStateAction<number>>;
}

export function NavBar(props: Props){

	return(
    <div className="navBar">
      <div className="navBarComponent">
        <h1 className="title">Game Of Life</h1>
      </div>
      <div className="navBarComponent">
        <ToggleButton isToggled={props.isPaused} setIsToggled={props.setIsPaused} toggledOffText={"Pause"} toggledOnText={"Play"}/>
        <ToggleButton isToggled={props.isDrawMode} setIsToggled={props.setIsDrawMode} toggledOffText={"Draw"} toggledOnText={"Pan"}/>
        <Slider min={props.minTickRate} max={props.maxTickRate} current={props.currentTickRate} setCurrent={props.setCurrentTickRate}/>
      </div>
    </div>
	)
}