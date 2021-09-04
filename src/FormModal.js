import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import sample_data from "./sample_data.json";
import Joi from "joi";
import FormInput from "./FormInput";

function FormModal({
  formData,
  handleSetData,
  errors,
  handleSetErrors,
  openModal,
  onOpenModal,
  onCloseModal,
}) {
  const handleChange = async (e) => {
    handleSetErrors("");

    let old = { ...formData };
    old[e.target.name] = e.target.value;

    await handleSetData(old);
  };

  const formatJoiError = (error) => {
    console.log("formatJoiError");
    const errorToReturn = {};
    errorToReturn._original = error._original; // property put in errorToReturn obj
    errorToReturn.details = {};
    error.details.forEach((detail) => {
      errorToReturn.details[detail.path] = detail.message;
    });

    return errorToReturn;
  };

  const validateData = (data) => {
    console.log("validateData");
    const schema = Joi.object({
      yourQuestion: Joi.string().required().messages({
        "string.empty": "Your Quesiton is not allowed to be empty",
      }),
      nickName: Joi.string().required().messages({
        "string.empty": "NickName is not allowed to be empty",
      }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty":
            "Email is not allowed to be empty or email format is incorrect",
        }),
    }).options({ abortEarly: false });

    return schema.validate(data);
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit");
    e.preventDefault();

    let { error } = validateData(formData);

    if (error) {
      let errorData = formatJoiError(error);

      handleSetErrors({ errorData: errorData || null });

      return;
    } else {
      onCloseModal(true);
    }
  };
  console.log("data:", formData);
  console.log("errors:", errors);

  return (
    <div>
      <Modal open={openModal} onClose={onCloseModal} center>
        <h2>Ask Your Question</h2>
        <p>About the {sample_data.product_id} </p>
        {errors && (
          <p style={{ color: "red" }}>
            1. Any mandatory fields are blank <br />
            2. The email address provided is not in correct email format
          </p>
        )}
        <form>
          <FormInput
            type="text"
            label="Your Question"
            name="yourQuestion"
            value={formData.yourQuestion}
            onChange={(e) => handleChange(e)}
          />

          <FormInput
            type="text"
            label="NickName"
            name="nickName"
            value={formData.nickName}
            onChange={handleChange}
            placeholder="“Example: jackson11!"
          />
          <p>
            "“For privacy reasons, do not use your full name or email address"
          </p>
          <FormInput
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p>"For authentication reasons, you will not be emailed"</p>

          <button onClick={handleSubmit}>Submit Question</button>
        </form>
      </Modal>
    </div>
  );
}

export default FormModal;
