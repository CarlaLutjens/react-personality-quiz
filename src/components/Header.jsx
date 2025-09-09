import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header>
      <h2>Which element are you?</h2>
      <p>(based on completely random things)</p>
      <Link to="/">Home</Link>
      <Link to="/quiz">Quiz</Link>
    </header>
  );
};
