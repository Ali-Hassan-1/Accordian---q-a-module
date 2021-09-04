import React, { useState, useEffect } from "react";

import sample_data from "./sample_data.json";
import SingleQuestion from "./Question";
import FormModal from "./FormModal";

const App = () => {
  const [questions, setQuestions] = useState(sample_data.results);
  const [loadPosts, setLoadPosts] = useState([]);
  const [startIndexOfSliceArray, setStartIndexOfSliceArray] = useState(0);
  let [endIndexOfSliceArray, setEndIndexOfSliceArray] = useState(2);
  const [loadMorebtnDisable, setLoadMorebtnDisable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal

  const [data, setData] = React.useState({
    yourQuestion: "",
    nickName: "",
    email: "",
  });
  const [errors, setErrors] = useState();

  const [openModal, setOpenModal] = useState(false);
  const onOpenModal = () => setOpenModal(true);
  const onCloseModal = () => setOpenModal(false);

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

    // setEndIndexOfSliceArray((end += 2));
  };

  const handleLoadMorePosts = () => {
    if (searchQuery) {
      setSearchQuery("");
      setLoadMorebtnDisable(false);
    }

    setEndIndexOfSliceArray((endIndexOfSliceArray += 2));
    slicedPosts(startIndexOfSliceArray, endIndexOfSliceArray);
  };

  const handleSearch = (query) => {
    if (query) setLoadMorebtnDisable(false);
    setSearchQuery(query);
    slicedPosts(0, 2);

    // else setLoadMorebtnDisable(false);
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
          errors={errors}
          handleSetErrors={(errors) => setErrors(errors)}
          handleSetData={(data) => setData(data)}
          openModal={openModal}
          onOpenModal={onOpenModal}
          onCloseModal={onCloseModal}
        />
      </div>
    </main>
  );
};

export default App;
