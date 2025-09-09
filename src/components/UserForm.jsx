import { useState, useContext } from "react";
import { UserContext } from "@/context/UserProvider";

export const UserForm = () => {
  const [inputName, setInputName] = useState("");
  const { setName } = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();
    setName(inputName); // Set the name in context
    window.history.pushState({}, "", "/quiz"); // Change the URL without reloading the page
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent); // Dispatch a navigation event
  }

  const handleChange = (e) => {
    setInputName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        value={inputName}
        type="text"
        onChange={handleChange}
      />
      <button type="submit">Continue</button>
    </form>
  );
};
