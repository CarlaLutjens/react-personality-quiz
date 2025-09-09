import { useContext } from "react";
import { UserContext } from "@/context/UserProvider";

export const Results = ({ element, artwork }) => {
  const { name } = useContext(UserContext);

  return (
    <div>
      <p>
        <strong>{name}</strong>, your element is: {element}
      </p>
      {artwork ? (
        <div className="artwork">
          <h2>{artwork.title}</h2>
          <img src={artwork.primaryImage || artwork} alt={artwork.title} />
          {/* API perritos => src={artwork} */}
          <p>{artwork.artistDisplayName}</p>
          <p>{artwork.objectDate}</p>
        </div>
      ) : (
        <p>No artwork found. Using safe image </p>
      )}
    </div>
  );
};
