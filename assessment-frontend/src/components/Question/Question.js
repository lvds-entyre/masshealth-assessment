// src/components/Question/Question.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { marked } from 'marked';
import './Question.css'; // Import the component-specific CSS

function Question({
  question,
  options = [],          // Default parameter for options
  onAnswer,
  type,
  explanation = '',      // Default parameter for explanation
}) {
  const [inputValue, setInputValue] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = (option) => {
    if (selectedOption) return; // Prevent multiple selections
    console.log(`Option clicked: ${option} for question: ${question}`); // Enhanced log
    setSelectedOption(option);
    onAnswer(option);
  };

  const handleInputChange = (e) => {
    console.log(`Input changed: ${e.target.value}`); // Debugging log
    setInputValue(e.target.value);
  };

  const handleNext = () => {
    if (inputValue === '') {
      alert('Please enter a value.');
      return;
    }
    console.log(`Next clicked with input: ${inputValue}`); // Debugging log
    onAnswer(inputValue);
    setInputValue('');
  };

  const toggleExplanation = () => {
    console.log(`Toggle explanation to: ${!showExplanation}`); // Debugging log
    setShowExplanation((prev) => !prev);
  };

  return (
    <div className="question-container">
      <div className="question-card">
        <h2 className="question-text">{question}</h2>

        {explanation && (
          <button
            className="explanation-toggle"
            onClick={toggleExplanation}
            aria-expanded={showExplanation}
            aria-controls="explanation-content"
          >
            {showExplanation ? 'Hide Explanation' : 'Need Help?'}
          </button>
        )}

        {showExplanation && explanation && (
          <div
            id="explanation-content"
            className="question-explanation"
            dangerouslySetInnerHTML={{ __html: marked.parse(explanation) }}
          />
        )}

        {type === 'options' && (
          <div className="options-container">
            {options.map((option) => (
              <button
                key={`${question}-${option}`} // Ensuring unique keys
                className={`option-button ${
                  selectedOption === option ? 'selected' : ''
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedOption}
                aria-pressed={selectedOption === option}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {type === 'number' && (
          <div className="input-container">
            <input
              type="number"
              className="number-input"
              value={inputValue}
              onChange={handleInputChange}
              min="1"
              aria-label="Enter a number"
            />
            <button
              className="next-button"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Define PropTypes for better type checking
Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  onAnswer: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['options', 'number', 'text']).isRequired,
  explanation: PropTypes.string,
};

// Remove defaultProps as they are now handled via default parameters

export default Question;
