//Me faltaron {} en parámetros
export const Question = ({ question, options, onAnswer }) => {
  return (
    <>
      <h2>{question}</h2>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => {
            onAnswer(option);
          }}
        >
          {option}
        </button>
      ))}
    </>
  );
};
