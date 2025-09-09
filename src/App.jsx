import { useState, useEffect } from "react";
import { UserProvider } from "@/context/UserProvider";
import { Header } from "./components/Header";
import { UserForm } from "./components/UserForm";
import { Question } from "./components/Question";
import { Results } from "./components/Results";
import { Routes, Route } from "react-router-dom";

function App() {
  const questions = [
    {
      question: "What's your favorite color?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "Which color do you think describes you better?",
      options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
    },
    {
      question: "Which do you like more?",
      options: ["Cherry", "Pineapple", "Kiwi", "Lemon"],
    },
  ];

  const keywords = {
    Fire: "fire",
    Water: "water",
    Earth: "earth",
    Air: "air",
  };

  const elements = {
    "Red 🔴": "Fire",
    "Blue 🔵": "Water",
    "Green 🟢": "Earth",
    "Yellow 🟡": "Air",
    Cherry: "Fire",
    Pineapple: "Water",
    Kiwi: "Earth",
    Lemon: "Air",
    // Continue mapping all your possible options to a keyword
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState("");
  const [element, setElement] = useState("");
  const [artwork, setArtwork] = useState(null);

  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
  }

  function determineElement(answers) {
    const counts = {};
    //answers = ['Yellow'] --> Array de respuestas que usuario dio
    answers.forEach(function (answer) {
      // answer = Yellow --> Transformación a string
      const element = elements[answer]; // Air --> Mapeado a elemento que corresponde
      //Cantidad de respuestas mapeadas a elementos counts = { Air: 1 }
      counts[element] = (counts[element] || 0) + 1; // counts[element] = 1
    });
    return Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b; // Me entrega el item que tiene que tiene conteo mas alto
    });
  }

  const fetchArtwork = async (q) => {
    //Hago fetch objectIDs que cumplen la condición de tener imagenes y que tienen como query el objeto
    const response = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${q}`
    );
    if (!response.ok)
      throw new Error(
        `Search failed: ${response.status} ${response.statusText}`
      );
    const data = await response.json();
    const objectIds = data.objectIDs;
    //Genero una numero random entre 0 y el largo de la lista para generar un índice
    const randomIndex = Math.floor(Math.random() * objectIds.length);

    //Obtengo un objectId random gracias al índice anterior, esto me permite generar un id válido para la API
    const objectId = objectIds[randomIndex];

    //Hago fetch del objeto con id válido
    const artResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );
    if (!artResponse.ok)
      throw new Error(
        `Search failed: ${artResponse.status} ${artResponse.statusText}`
      );
    const artData = await artResponse.json();

    if (artData.primaryImage) {
      return setArtwork(artData);
    } else {
      const safeImageRes = await fetch(
        "https://dog.ceo/api/breeds/image/random"
      );
      const safeImageData = await safeImageRes.json();
      return setArtwork(safeImageData.message);
    }
  };

  useEffect(
    function () {
      if (currentQuestionIndex === questions.length) {
        const selectedElement = determineElement(answers);
        //Earth
        setElement(selectedElement);
        //earth
        fetchArtwork(keywords[selectedElement]);
      }
    },
    [currentQuestionIndex]
  );

  return (
    <>
      <UserProvider value={{ name: userName, setName: setUserName }}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<UserForm onSubmit={handleUserFormSubmit} />}
          />
          <Route
            path="/quiz"
            element={
              currentQuestionIndex < questions.length ? (
                <Question
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  onAnswer={handleAnswer}
                />
              ) : (
                <Results element={element} artwork={artwork} />
              )
            }
          />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
