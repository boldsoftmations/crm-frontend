import React, { useState, useEffect } from "react";

const TypoAnimation = ({
  percent,
  misssingKeyWords,
  text = "",
  speed = 10,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setTypingComplete(false);

    if (typeof text !== "string") {
      console.warn("Invalid text prop:", text);
      return;
    }

    let index = 0;

    const typeCharacter = () => {
      if (index < text.length) {
        setDisplayedText((prevText) => prevText + text[index]);
        index += 1;
        setTimeout(typeCharacter, speed);
      } else {
        setTypingComplete(true);
      }
    };

    typeCharacter();

    return () => {
      setTypingComplete(true);
    };
  }, [text, speed]);

  return (
    <div className="typo-animation-container">
      <div className="percent-container">
        <span className="final-thoughts-label">Match Percentage :</span>
        <span className="percent-value">{percent}%</span>
      </div>
      <div className="keywords-container">
        <span className="keywords-label">Missing Keywords :</span>
        <ul className="keywords-list">
          {misssingKeyWords &&
            misssingKeyWords.map((word, index) => (
              <li key={index} className="keyword-item">
                {word}
              </li>
            ))}
        </ul>
      </div>
      <span className="final-thoughts-label">Final Thoughts :</span>
      <span style={{ fontWeight: 300, opacity: 0.8, fontSize: "14.4px" }}>
        {displayedText}
      </span>
      {!typingComplete && <span className="cursor">|</span>}
    </div>
  );
};

export default TypoAnimation;
