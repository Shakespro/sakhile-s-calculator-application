import { useState } from 'react';
import './App.css';
import numberToWords from 'number-to-words';

function App() {
  const [answer, setAnswer] = useState("");
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false); // New state for error handling
  const et = expression.trim();
  
  const MAX_DIGITS = 10; // Maximum digits per number in the expression
  
  const isOperator = (symbol: string) => {
    return /[*/+-]/.test(symbol);
  };

  const buttonPress = (symbol: string) => {
    if (error) {
      resetCalculator(); // Reset if there is an error
    }
    
    if (symbol === "clear") {
      setAnswer("");
      setExpression("0");
      setError(false); // Reset error state
    } else if (symbol === "negative") {
      if (answer === "") return;
      setAnswer(answer.charAt(0) === "-" ? answer.slice(1) : "-" + answer);
    } else if (symbol === "percent") {
      if (answer === "") return;
      setAnswer((parseFloat(answer) / 100).toString());
    } else if (isOperator(symbol)) {
      setExpression(et + " " + symbol + " ");      
    } else if (symbol === "=") {
      calculate(); 
    } else if (symbol === "0") {
      if (expression.charAt(0) !== "0") {
        setExpression(expression + symbol);
      }
    } else if (symbol === ".") {
      const lastNumber = expression.split(/[-+*/]/g).pop();
      if (!lastNumber || lastNumber.includes(".")) return;
      setExpression(expression + symbol);
    } else {
      const lastNumber = expression.split(/[-+*/]/g).pop();
      if (lastNumber && lastNumber.replace(/[^0-9]/g, '').length >= MAX_DIGITS) return;

      if (expression.charAt(0) === "0") {
        setExpression(expression.slice(1) + symbol);
      } else {
        setExpression(expression + symbol);
      }
    }
  };

  const calculate = () => {
    if (isOperator(et.charAt(et.length - 1))) return;

    const parts = et.split(" ");
    const newParts = [];

    for (let i = parts.length - 1; i >= 0; i--) {
      if (["*", "/", "+"].includes(parts[i]) && isOperator(parts[i - 1])) {
        newParts.unshift(parts[i]);
        let j = 0;
        let k = i - 1; 
        while (isOperator(parts[k])) {
          k--;
          j++; 
        } 
        i -= j; 
      } else {
        newParts.unshift(parts[i]);
      }
    }

    const newExpression = newParts.join("");
    try {
      const result = isOperator(newExpression.charAt(0)) ? eval(answer + newExpression) : eval(newExpression);
      setAnswer(result.toString());
      setExpression("");
      setError(false); // Reset error state after successful calculation
    } catch (error) {
      setError(true); // Set error state on calculation failure
    }
  };

  const numberToWordsString = (answer: number) => {
    try {
      return numberToWords.toWords(answer);
    } catch (error) {
      setError(true); // Set error state if conversion fails
      return "";
    }
  };

  const resetCalculator = () => {
    setAnswer("");
    setExpression("");
    setError(false);
  };

  return (
    <>
      <h1>Sakhile's Calculator Application</h1>
      <div className="container">
        {error ? (
          <div id="error-message">
            <h2>Error: Answer is too large to express in this app</h2>
            <button style={{color: 'red'}}onClick={resetCalculator}>Go Back</button>
          </div>
        ) : (
          <>
            <div id="display">
              <div id="answer">Answer: {answer}</div>
              <div id="display-expression">Expression: {expression}</div>
            </div>
            <div id="calculator">
              <button id="clear" onClick={() => buttonPress("clear")} className="light-gray">C</button>
              <button id="negative" onClick={() => buttonPress("negative")} className="light-gray">+/−</button>
              <button id="percentage" onClick={() => buttonPress("percent")} className="light-gray">%</button>
              <button id="divide" onClick={() => buttonPress("/")} className="yellow">/</button>
              <button id="seven" onClick={() => buttonPress("7")} className="dark-gray">7</button>
              <button id="eight" onClick={() => buttonPress("8")} className="dark-gray">8</button>
              <button id="nine" onClick={() => buttonPress("9")} className="dark-gray">9</button>
              <button id="multiply" onClick={() => buttonPress("*")} className="yellow">*</button>
              <button id="four" onClick={() => buttonPress("4")} className="dark-gray">4</button>
              <button id="five" onClick={() => buttonPress("5")} className="dark-gray">5</button>
              <button id="six" onClick={() => buttonPress("6")} className="dark-gray">6</button>
              <button id="subtract" onClick={() => buttonPress("-")} className="yellow">−</button>
              <button id="one" onClick={() => buttonPress("1")} className="dark-gray">1</button>
              <button id="two" onClick={() => buttonPress("2")} className="dark-gray">2</button>
              <button id="three" onClick={() => buttonPress("3")} className="dark-gray">3</button>
              <button id="add" onClick={() => buttonPress("+")} className="yellow">+</button>
              <button id="zero" onClick={() => buttonPress("0")} className="dark-gray">0</button>
              <button id="decimal" onClick={() => buttonPress(".")} className="dark-gray">.</button>
              <button id="equals" onClick={() => buttonPress("=")} className="yellow">=</button>
            </div>
            <div id="inWords">Answer in words: {numberToWordsString(Number(answer))}</div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
