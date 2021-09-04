import React, { useState, useEffect } from "react";

import sample_data from "./sample_data.json";
import SingleQuestion from "./Question";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Joi from "joi";
import FormModal from "./FormModal";

const App = () => {
  const [questions, setQuestions] = useState(sample_data.results);
  const [loadPosts, setLoadPosts] = useState([]);
  const [startIndexOfSliceArray, setStartIndexOfSliceArray] = useState(0);
  const [endIndexOfSliceArray, setEndIndexOfSliceArray] = useState(2);
  const [loadMorebtnDisable, setLoadMorebtnDisable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal

  const [data, setData] = React.useState({
    yourQuestion: "",
    nickName: "",
    email: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);

  // const [error, setError] = React.useState();

  // const [openModal, setOpenModal] = useState(false);
  // const onOpenModal = () => setOpenModal(true);
  // const onCloseModal = () => setOpenModal(false);

  // const handleChange = async (e) => {
  //   setError("");

  //   let old = { ...data };
  //   old[e.target.name] = e.target.value;

  //   await setData(old);
  // };

  // const formatJoiError = (error) => {
  //   console.log("formatJoiError");
  //   const errorToReturn = {};
  //   errorToReturn._original = error._original; // property put in errorToReturn obj
  //   errorToReturn.details = {};
  //   error.details.forEach((detail) => {
  //     errorToReturn.details[detail.path] = detail.message;
  //   });

  //   return errorToReturn;
  // };

  // const validateData = (data) => {
  //   console.log("validateData");
  //   const schema = Joi.object({
  //     yourQuestion: Joi.string().required().messages({
  //       "string.empty": "Your Question is not allowed to be empty",
  //     }),
  //     nickName: Joi.string().required().messages({
  //       "string.empty": "Nick Name is not allowed to be empty",
  //     }),
  //     email: Joi.string()
  //       .email({ tlds: { allow: false } })
  //       .required()
  //       .messages({
  //         "string.empty":
  //           "Email is not allowed to be empty or email format is incorrect",
  //       }),
  //   }).options({ abortEarly: false });

  //   return schema.validate(data);
  // };

  // const handleSubmit = (e) => {
  //   console.log("handleSubmit");
  //   e.preventDefault();

  //   let { error } = validateData(data);

  //   if (error) {
  //     let errorData = formatJoiError(error);

  //     setError({ errorData: errorData || null });

  //     console.log("FormData:", data);
  //     console.log("error:", error);

  //     return;
  //   } else {
  //     onCloseModal(true);
  //   }
  // };

  // Modal

  useEffect(() => {
    slicedPosts();
  }, []);

  const slicedPosts = (start = 0, end = 2) => {
    const slicePosts = questions.slice(start, end);
    setLoadPosts(slicePosts);

    if (end >= questions.length) {
      setLoadMorebtnDisable(true);
      return;
    }

    setEndIndexOfSliceArray((end += 2));
  };

  const handleLoadMorePosts = () => {
    if (searchQuery) {
      setSearchQuery("");
    }

    slicedPosts(startIndexOfSliceArray, endIndexOfSliceArray);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    slicedPosts(0, 2);

    if (searchQuery.length > 1) setLoadMorebtnDisable(true);
    else setLoadMorebtnDisable(false);
  };

  const getFilteredQuestion = () => {
    let filteredPosts = loadPosts;

    if (searchQuery && searchQuery.length > 2) {
      filteredPosts = questions.filter(
        (data) =>
          data.question_body
            .toLocaleLowerCase()
            .search(searchQuery.toLocaleLowerCase()) !== -1
      );
    }
    return { filteredPosts };
  };

  const { filteredPosts } = getFilteredQuestion();

  return (
    <main>
      <div className="container">
        <h3>questions and answers</h3>
        <div>
          <input
            placeholder={`"Have a question? Search for Answer..."`}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchQuery}
          />
        </div>
        <section className="info">
          {filteredPosts.map((question) => (
            <SingleQuestion key={question.question_id} {...question} />
          ))}
        </section>
        <div className="btns">
          <button
            onClick={() => handleLoadMorePosts()}
            className={loadMorebtnDisable ? "disableBtn" : ""}
          >
            Load More
          </button>
          <button onClick={onOpenModal}>Add Question</button>
        </div>
      </div>

      <div>
        <FormModal
          formData={data}
          openModal={openModal}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
        />
        {/* <Modal open={openModal} onClose={onCloseModal} center>
            <h2>Ask Your Question</h2>
            <p>About the {sample_data.product_id} </p>
            {error && (
              <p style={{ color: "red" }}>
                1. Any mandatory fields are blank <br />
                2. The email address provided is not in correct email format
              </p>
            )}
            <form>
              <label>Your Question*</label>
              <br />
              <input
                type="text"
                name="yourQuestion"
                value={data.yourQuestion}
                onChange={(e) => handleChange(e)}
              />

              <br />
              <label>What is your nickname*</label>
              <br />
              <input
                type="text"
                name="nickName"
                placeholder="“Example: jackson11!"
                value={data.nickName}
                onChange={handleChange}
              />

              <p>
                "“For privacy reasons, do not use your full name or email
                address"
              </p>

              <label>Your email*</label>
              <br />
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
              />

              <br />
              <p>"For authentication reasons, you will not be emailed"</p>

              <button onClick={handleSubmit}>Submit Question</button>
            </form>
          </Modal> */}
      </div>
    </main>
  );
};

export default App;
