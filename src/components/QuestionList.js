import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  // Fetch all questions on mount
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // DELETE handler
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" }).then(
      () => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      }
    );
  }

  // PATCH handler with optimistic UI update
  function handleUpdateCorrectIndex(id, newIndex) {
    // Immediately update UI
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, correctIndex: newIndex } : q))
    );

    // Send update to server
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: newIndex }),
    }).catch((err) => console.error(err));
  }

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onUpdate={handleUpdateCorrectIndex}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
