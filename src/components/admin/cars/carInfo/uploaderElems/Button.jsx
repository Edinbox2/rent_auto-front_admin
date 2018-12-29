import React from "react";

const DeleteButton = (props) => {
  return <button onClick={(event)=>props.deleteHandler(event)}>{props.children}</button>;
};

export default DeleteButton;
