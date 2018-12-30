import React from "react";


export const Button = props => {
  return (
    <button onClick={e => props.clicked(e)}>
      {props.children}
    </button>
  );
};

export const Select = props =>{
  return (
    <select
    value={props.name}
    onChange={event => props.changed(event)}
  >
    {props.listOfImages
      ? props.listOfImages.map((item, index) => (
          <option key={index} value={item.name}>
            {item.name}
          </option>
        ))
      : null}
  </select>
  )
}

