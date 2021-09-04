import React from "react";

function FormInput({ name, label, ...rest }) {
  return (
    <div>
      <label>{label}*</label>
      <br />
      <input type="text" name={name} {...rest} />
    </div>
  );
}

export default FormInput;
