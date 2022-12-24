import React, { useRef, useState, useEffect } from "react";


const corrections = [
  {
    startIndex: 4,
    endIndex: 6,
    replacement: "only",
    original: "oly"
  },
  {
    startIndex: 17,
    endIndex: 20,
    replacement: "have",
    original: "gave"
  },
  {
    startIndex: 22,
    endIndex: 23,
    replacement: "to",
    original: "so"
  },
  {
    startIndex: 25,
    endIndex: 28,
    replacement: "fear",
    original: "feer"
  },
  {
    startIndex: 44,
    endIndex: 44,
    replacement: "?",
    original: "."
  }
];

export default () => {
  const rteRef = useRef(null);
  const [fix, setFix] = useState(0);
  const handleFixToggle = () => {
    let localFix = fix + 1;
    if (fix === 0) setFix(localFix);
  };
  useEffect(() => {
    if (fix > 0) {
      const localCorrections = [...corrections];
      let actualCounter = 0;
      let currCorrcPtr = 0;
      const customFixer = (node) => {
        return node?.childNodes.forEach((item) => {
          if (item.hasChildNodes()) {
            customFixer(item);
          } else {
            if (currCorrcPtr < localCorrections.length) {
              const textLength = item.textContent.length;
              let text = item.textContent;
              const currCorrStart = localCorrections[currCorrcPtr].startIndex;
              // from here it should loop
              if (currCorrStart >=actualCounter && currCorrStart < (textLength + actualCounter)) {
                while (true) {
                  const currCorrStart = localCorrections[currCorrcPtr].startIndex;
                  const currCorrEnd = localCorrections[currCorrcPtr].endIndex;
                  const maxIndex = actualCounter+textLength >= currCorrEnd ? localCorrections[currCorrcPtr].replacement.length : textLength;
                  const replacement = localCorrections[currCorrcPtr].replacement.substring(0, maxIndex);
                  text = text.substring(0, currCorrStart - actualCounter) +  replacement +  text.substring(currCorrEnd - actualCounter + 1, text.length);              
                  if (actualCounter+text.length >= currCorrEnd) {
                    // make sure next correction is not in the same text
                    const nextPtr = currCorrcPtr+1;
                    const nextCorrStart = localCorrections[nextPtr]?.startIndex;
                    if (nextCorrStart && nextCorrStart >=actualCounter && nextCorrStart < (item.textContent.length + actualCounter)) {
                        const nextPtr = currCorrcPtr + 1;
                        const changeInText = text.length - textLength;
                        localCorrections[nextPtr].startIndex += changeInText; 
                        localCorrections[nextPtr].endIndex += changeInText;
                        currCorrcPtr = nextPtr;
                    } else {
                      currCorrcPtr = nextPtr;
                      break;
                    }
                    
                  } else {
                    localCorrections[currCorrcPtr].startIndex = actualCounter + textLength;
                    localCorrections[currCorrcPtr].replacement = localCorrections[currCorrcPtr].replacement.substring(maxIndex, localCorrections[currCorrcPtr].replacement.length);
                    break;
                  }
                };
              
              }      
              actualCounter+=textLength;
              item.textContent= text;
          }
            return item;
          }
        });
      };
      customFixer(rteRef.current);
    }
  }, [fix]);
  return (
    <div className="rct-editor">
      <div id="element" ref={rteRef}>
        <p style={{ fontSize: "16px" }}>
          The oly thing we gave so{" "}
          <span style={{ color: "blue" }}>
            <span style={{ fontSize: "30px" }}>f</span>eer is fear
          </span>{" "}
          itself.
        </p>
      </div>
      <button onClick={handleFixToggle}>Fix me</button>
    </div>
  );
}
