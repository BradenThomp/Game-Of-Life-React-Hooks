import React from "react";
import '../index.css'

interface Props {
  min: number;
  max: number;
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}


export function Slider(props: Props){
	return(
    <input className="slider" type="range" min={props.min} max={props.max} value={props.current} onChange={(event) => props.setCurrent(event.target.valueAsNumber)}/>
  );
}