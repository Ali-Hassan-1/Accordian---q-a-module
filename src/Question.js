import React, { useState, useEffect } from "react";
import moment from "moment";
import { Element } from "react-scroll";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Joi from "joi";
import FileBase from "react-file-base64";

const Question = ({ question_id, question_body, answers }) => {
  const [expanded, setExpanded] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);
  const [pickedAnswers, setPickedAnswers] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [collapseBtn, setCollapseBtn] = useState(false);
  const [showMoreAnsBtn, setShowMoreAnsBtn] = useState(false);
  const startIndex = 0;
  let endIndex = 2;
  // Modal
  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);
  const [errors, setErrors] = useState();
  const [data, setData] = useState({
    yourAnswer: "",
    nickName: "",
    email: "",
  });

  // Modal

  useEffect(() => {
    getAnswers();
  }, []);

  const slicedAnswersFunc = (arrayOfAnswers, start, end) => {
    if (arrayOfAnswers.length > 2) {
      setShowMoreAnsBtn(true);
    }

    const slicedAnswers = arrayOfAnswers.slice(start, end);

    return slicedAnswers;
  };

  const getAnswers = () => {
    const ansKeys = Object.keys(answers);
    const eachAnswers = ansKeys.map((key) => answers[key]);
    const arrayOfAnswers = eachAnswers
      .map((answer) => answer)
      .sort((a, b) => b.helpfulness - a.helpfulness);

    setAllAnswers(arrayOfAnswers);

    const sliceableAns = slicedAnswersFunc(
      arrayOfAnswers,
      startIndex,
      endIndex
    );
    setPickedAnswers(sliceableAns);
    setExpanded(true);
    setCollapseBtn(false);
  };

  const handleShowMore = () => {
    endIndex = allAnswers.length;

    const slicedAnswers = slicedAnswersFunc(allAnswers, startIndex, endIndex);
    setPickedAnswers(slicedAnswers);

    if (endIndex >= allAnswers.length) {
      setShowMoreAnsBtn(false);
      setCollapseBtn(true);
      return;
    }
  };

  const handleCollapse = () => {
    const slicedAnswers = slicedAnswersFunc(
      allAnswers,
      startIndex,
      (endIndex = 2)
    );

    setPickedAnswers(slicedAnswers);
    setExpanded(false);
  };

  // Modal

  const handleChange = ({ currentTarget: input }) => {
    console.log("..handleChange..");
    setErrors("");
    data[input.name] = input.value;

    let oldData = { ...data }; // old type value

    setData(oldData);
  };

  const validateData = (data) => {
    const schema = Joi.object({
      yourAnswer: Joi.string().required().messages({
        "string.empty": "Your Answer should not allowed to be empty!",
      }),

      nickName: Joi.string().required().messages({
        "string.empty": "Your nickName should not allowed to be empty!",
      }),

      email: Joi.string().email({ tlds: false }).required().messages({
        "string.empty": "Your email should not allowed to be empty!",
      }),
    }).options({ abortEarly: false });

    return schema.validate(data);
  };

  const formatJoiError = (error) => {
    console.log("..formatJoiError..");
    let errorToReturn = {};

    errorToReturn._original = error._original;

    errorToReturn.details = {};
    error.details.forEach((singleErrorDetail) => {
      errorToReturn.details[singleErrorDetail.path] = singleErrorDetail;
    });

    return errorToReturn;
  };

  const handleSubmit = (e) => {
    console.log("..handleSubmit..");
    e.preventDefault();

    if (selectedFile.length < 5 || selectedFile.length > 5) {
      let fileError = "Image should not allowed to be empty! Select 5 images";

      setErrors({ ...errors, fileError });

      return;
    }

    const { error } = validateData(data);

    if (error) {
      const formatError = formatJoiError(error);
      setErrors(formatError);

      return;
    }

    setOpenModal(false);
  };
  // Modal
  return (
    <article className="question">
      <header>
        <h4
          onClick={() => setExpanded(!expanded) & setCollapseBtn(false)}
          className="question-title"
        >
          {question_body}
        </h4>
        <span>
          Helpful?{" "}
          <a href="#1" onClick={() => console.log("QID:", question_id)}>
            Yes
          </a>{" "}
          |{" "}
          <a href="#1" onClick={onOpenModal}>
            {" "}
            Add Answer
          </a>
        </span>
      </header>
      <>
        {expanded && (
          <>
            {allAnswers.length > 3 && (
              <>
                <Element
                  className="element"
                  id="containerElement"
                  style={{
                    position: "relative",
                    height: "200px",
                    overflow: "scroll",
                  }}
                >
                  {pickedAnswers.map((answer) => (
                    <div key={answer.id}>
                      <p>
                        <b>A:</b>
                        {answer.body}
                      </p>
                      <p>
                        {`"by [${answer.answerer_name}] ${moment(
                          answer.date
                        ).format("MMMM, DD, YYYY")}" Helpful? `}
                        <span>
                          <a
                            onClick={() => console.log("Helpfull:", answer.id)}
                            href="#1"
                          >
                            Yes
                          </a>{" "}
                          |{" "}
                          <a
                            onClick={() => console.log("Report:", answer.id)}
                            href="#1"
                          >
                            Report
                          </a>
                        </span>
                      </p>
                    </div>
                  ))}
                  {showMoreAnsBtn && (
                    <button onClick={() => handleShowMore()}>
                      See more Answers
                    </button>
                  )}
                </Element>
                {collapseBtn && (
                  <button onClick={() => handleCollapse()}>Collapse</button>
                )}
              </>
            )}
            {allAnswers.length < 3 && (
              <Element>
                {pickedAnswers.map((answer) => (
                  <div key={answer.id}>
                    <p>
                      <b>A:</b>
                      {answer.body}
                    </p>
                    <p>
                      {`"by [${answer.answerer_name}] ${moment(
                        answer.date
                      ).format("MMMM, DD, YYYY")}" Helpful? `}
                      <span>
                        <a
                          onClick={() => console.log("Helpfull:", answer.id)}
                          href="#1"
                        >
                          Yes
                        </a>{" "}
                        |{" "}
                        <a
                          onClick={() => console.log("Report:", answer.id)}
                          href="#1"
                        >
                          Report
                        </a>
                      </span>
                    </p>
                  </div>
                ))}
              </Element>
            )}
          </>
        )}
      </>
      <div>
        <Modal open={openModal} onClose={onCloseModal} center>
          <h2>Submit Your Answer</h2>
          {errors && (
            <p style={{ color: "red" }}>
              1. Any mandatory fields are blank <br /> 2. The email address
              provided is not in correct email format <br /> 3. The images
              selected are invalid or unable to be uploaded
            </p>
          )}
          <form>
            <label>Your Answer*</label>
            <br />
            <input
              type="text"
              name="yourAnswer"
              value={data.yourAnswer}
              onChange={handleChange}
            />
            <br />
            <label>NickName*</label>
            <br />
            <input
              placeholder={`"Example: jack615"`}
              type="text"
              name="nickName"
              value={data.nickName}
              onChange={handleChange}
            />
            <p>
              "For privacy reasons, do not use your full name or email address"
            </p>

            <label>Email*</label>
            <br />
            <input
              placeholder="jack@email.com"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <p>"For authentication reasons, you will not be emailed"</p>

            <FileBase
              type="file"
              multiple={true}
              onDone={(value) => {
                console.log("BASE64: ", value);
                setSelectedFile(value);
              }}
            />
            <br />
            <br />
            <button onClick={handleSubmit}>Submit</button>
          </form>
        </Modal>
      </div>
    </article>
  );
};

export default Question;
