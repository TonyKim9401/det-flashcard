import React, { useState, useMemo } from "react";
import {
  Check,
  X,
  ArrowRight,
  RotateCcw,
  BookmarkCheck,
  BookmarkX,
} from "lucide-react";

const FlashcardApp = () => {
  const [mode, setMode] = useState(null);
  const [wordFilter, setWordFilter] = useState("all"); // 'all', 'memorized', 'unmemorized'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [storyAnswers, setStoryAnswers] = useState({});

  // 단어 데이터 (memorized 상태 추가)
  const [words, setWords] = useState([
    {
      english: "accomplish",
      korean: "성취하다, 달성하다",
      example: "She accomplished her goal of running a marathon.",
      wrongOptions: ["포기하다", "시작하다", "지연하다"],
      memorized: false,
    },
    {
      english: "essential",
      korean: "필수적인, 본질적인",
      example: "Water is essential for life.",
      wrongOptions: ["선택적인", "불필요한", "부차적인"],
      memorized: false,
    },
    {
      english: "perspective",
      korean: "관점, 시각",
      example: "We need to look at this from a different perspective.",
      wrongOptions: ["거울", "장애물", "목표"],
      memorized: false,
    },
    {
      english: "significant",
      korean: "중요한, 의미 있는",
      example: "This discovery has significant implications for science.",
      wrongOptions: ["사소한", "무의미한", "평범한"],
      memorized: false,
    },
    {
      english: "establish",
      korean: "설립하다, 확립하다",
      example: "The company was established in 1995.",
      wrongOptions: ["파괴하다", "무시하다", "연기하다"],
      memorized: false,
    },
  ]);

  // 필터링된 단어 목록
  const filteredWords = useMemo(() => {
    if (wordFilter === "all") return words;
    if (wordFilter === "memorized") return words.filter((w) => w.memorized);
    if (wordFilter === "unmemorized") return words.filter((w) => !w.memorized);
    return words;
  }, [words, wordFilter]);

  // 스토리 데이터
  const stories = [
    {
      text: "Sarah wanted to ___ her dream of becoming a doctor. It was ___ for her to study hard every day. From her ___, success required dedication and sacrifice. After years of effort, she made ___ progress in her studies. Finally, she was able to ___ herself as a respected physician.",
      words: [
        "accomplish",
        "essential",
        "perspective",
        "significant",
        "establish",
      ],
      translations: ["성취하다", "필수적인", "관점", "중요한", "설립하다"],
      hints: ["acco", "esse", "pers", "sign", "esta"],
    },
  ];

  // 모드 1: 객관식
  const currentWord = filteredWords[currentIndex];
  const options = useMemo(() => {
    if (!currentWord) return [];
    const allOptions = [currentWord.korean, ...currentWord.wrongOptions];
    return allOptions.sort(() => Math.random() - 0.5);
  }, [currentIndex, filteredWords]);

  // 모드 2: 스펠링 채우기
  const hintLength = useMemo(() => {
    if (!currentWord) return 0;
    const len = currentWord.english.length;
    return Math.floor(len * 0.3); // 30% 정도를 힌트로
  }, [currentWord]);

  const hint = currentWord?.english.slice(0, hintLength) || "";
  const blanksCount = (currentWord?.english.length || 0) - hintLength;

  // 모드 3: 스토리
  const currentStory = stories[0];
  const storyParts = currentStory.text.split("___");

  const toggleMemorized = (index) => {
    const newWords = [...words];
    newWords[index].memorized = !newWords[index].memorized;
    setWords(newWords);
  };

  const handleMode1Answer = (selected) => {
    if (selected === currentWord.korean) {
      setScore(score + 1);
    }
    setUserAnswer(selected);
    setShowAnswer(true);
  };

  const handleMode2Check = () => {
    const fullAnswer = hint + userAnswer.toLowerCase();
    if (fullAnswer === currentWord.english.toLowerCase()) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  const handleMode3Check = () => {
    let correct = 0;
    currentStory.words.forEach((word, idx) => {
      const fullAnswer = currentStory.hints[idx] + (storyAnswers[idx] || "");
      if (fullAnswer.toLowerCase() === word.toLowerCase()) {
        correct++;
      }
    });
    setScore(correct);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
    } else {
      alert(`학습 완료! 점수: ${score}/${filteredWords.length}`);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowAnswer(false);
    setScore(0);
    setStoryAnswers({});
    setMode(null);
  };

  const selectModeWithFilter = (selectedMode) => {
    if (selectedMode === 3) {
      // 스토리 모드는 필터 없이 바로 시작
      setMode(selectedMode);
    } else {
      // 객관식, 스펠링 채우기는 필터 체크
      if (filteredWords.length === 0) {
        alert("선택한 조건에 해당하는 단어가 없습니다!");
        return;
      }
      setMode(selectedMode);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-indigo-900">
            DET 단어 카드
          </h1>

          {/* 단어 필터 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              학습할 단어 선택
            </h2>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setWordFilter("all")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  wordFilter === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전체 ({words.length}개)
              </button>
              <button
                onClick={() => setWordFilter("unmemorized")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  wordFilter === "unmemorized"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                미암기 ({words.filter((w) => !w.memorized).length}개)
              </button>
              <button
                onClick={() => setWordFilter("memorized")}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  wordFilter === "memorized"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                암기완료 ({words.filter((w) => w.memorized).length}개)
              </button>
            </div>

            {/* 단어 목록 */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-indigo-700">
                      {word.english}
                    </span>
                    <span className="text-gray-600 ml-3">{word.korean}</span>
                  </div>
                  <button
                    onClick={() => toggleMemorized(index)}
                    className={`p-2 rounded-lg transition-all ${
                      word.memorized
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                    }`}
                  >
                    {word.memorized ? (
                      <BookmarkCheck size={20} />
                    ) : (
                      <BookmarkX size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 학습 모드 선택 */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => selectModeWithFilter(1)}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">객관식</h2>
              <p className="text-gray-600 mb-2">
                단어의 뜻을 4개 보기 중에서 선택하세요
              </p>
              <p className="text-sm text-indigo-600 font-medium">
                {wordFilter === "all" && `전체 ${filteredWords.length}개 출제`}
                {wordFilter === "memorized" &&
                  `암기완료 ${filteredWords.length}개 출제`}
                {wordFilter === "unmemorized" &&
                  `미암기 ${filteredWords.length}개 출제`}
              </p>
            </button>

            <button
              onClick={() => selectModeWithFilter(2)}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-4">✍️</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                스펠링 채우기
              </h2>
              <p className="text-gray-600 mb-2">
                단어의 빈칸을 채워서 완성하세요
              </p>
              <p className="text-sm text-indigo-600 font-medium">
                {wordFilter === "all" && `전체 ${filteredWords.length}개 출제`}
                {wordFilter === "memorized" &&
                  `암기완료 ${filteredWords.length}개 출제`}
                {wordFilter === "unmemorized" &&
                  `미암기 ${filteredWords.length}개 출제`}
              </p>
            </button>

            <button
              onClick={() => selectModeWithFilter(3)}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                스토리 완성
              </h2>
              <p className="text-gray-600 mb-2">
                이야기의 빈칸을 채워서 완성하세요
              </p>
              <p className="text-sm text-gray-500 font-medium">
                전체 단어 반복 학습
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw size={20} /> 처음으로
            </button>
            <div className="text-lg font-semibold text-indigo-900">
              {currentIndex + 1} / {filteredWords.length} | 점수: {score}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold text-indigo-600 mb-4">
                {currentWord.english}
              </h2>
              <p className="text-gray-500">알맞은 뜻을 선택하세요</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !showAnswer && handleMode1Answer(option)}
                  disabled={showAnswer}
                  className={`p-4 rounded-lg text-lg font-medium transition-all ${
                    showAnswer
                      ? option === currentWord.korean
                        ? "bg-green-100 border-2 border-green-500 text-green-800"
                        : option === userAnswer
                        ? "bg-red-100 border-2 border-red-500 text-red-800"
                        : "bg-gray-100 text-gray-500"
                      : "bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 hover:border-indigo-400"
                  }`}
                >
                  {option}
                  {showAnswer && option === currentWord.korean && (
                    <Check className="inline ml-2" size={20} />
                  )}
                  {showAnswer &&
                    option === userAnswer &&
                    option !== currentWord.korean && (
                      <X className="inline ml-2" size={20} />
                    )}
                </button>
              ))}
            </div>

            {showAnswer && (
              <button
                onClick={nextQuestion}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                다음 문제 <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw size={20} /> 처음으로
            </button>
            <div className="text-lg font-semibold text-indigo-900">
              {currentIndex + 1} / {filteredWords.length} | 점수: {score}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-4">
                빈칸에 들어갈 철자를 입력하세요
              </p>
              <div className="flex justify-center items-center gap-1">
                {hint.split("").map((char, idx) => (
                  <div
                    key={`hint-${idx}`}
                    className="w-12 h-14 flex items-center justify-center text-3xl font-bold text-indigo-600 border-b-4 border-indigo-300"
                  >
                    {char}
                  </div>
                ))}
                {Array.from({ length: blanksCount }).map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={userAnswer[idx] || ""}
                    onChange={(e) => {
                      const newAnswer = userAnswer.split("");
                      newAnswer[idx] = e.target.value.toLowerCase();
                      setUserAnswer(newAnswer.join(""));

                      // 자동으로 다음 칸으로 이동
                      if (e.target.value && idx < blanksCount - 1) {
                        const nextInput =
                          document.querySelectorAll('input[type="text"]')[
                            idx + 1
                          ];
                        if (nextInput) nextInput.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // 백스페이스로 이전 칸으로 이동
                      if (
                        e.key === "Backspace" &&
                        !userAnswer[idx] &&
                        idx > 0
                      ) {
                        const prevInput =
                          document.querySelectorAll('input[type="text"]')[
                            idx - 1
                          ];
                        if (prevInput) prevInput.focus();
                      }
                    }}
                    className="w-12 h-14 text-3xl text-center border-b-4 border-indigo-600 focus:border-indigo-800 focus:outline-none bg-indigo-50 font-bold text-indigo-900"
                    placeholder=" "
                  />
                ))}
              </div>
            </div>

            {!showAnswer ? (
              <>
                <button
                  onClick={handleMode2Check}
                  disabled={userAnswer.length !== blanksCount}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  정답 확인
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    (hint + userAnswer).toLowerCase() ===
                    currentWord.english.toLowerCase()
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">정답:</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {currentWord.english}
                    </p>
                    <p className="text-xl text-gray-700 mt-2">
                      {currentWord.korean}
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">예문:</p>
                  <p className="text-gray-800">{currentWord.example}</p>
                </div>
                <button
                  onClick={nextQuestion}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  다음 문제 <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <RotateCcw size={20} /> 처음으로
            </button>
            <div className="text-lg font-semibold text-indigo-900">
              점수: {score} / {currentStory.words.length}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">
              스토리 완성하기
            </h2>

            {!showAnswer ? (
              <>
                <div className="bg-gray-50 p-6 rounded-lg mb-6 text-lg leading-relaxed">
                  {storyParts.map((part, idx) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < storyParts.length - 1 && (
                        <span className="inline-flex items-center gap-0 mx-1">
                          {currentStory.hints[idx]
                            .split("")
                            .map((char, charIdx) => (
                              <span
                                key={`hint-${idx}-${charIdx}`}
                                className="inline-block w-6 text-center font-bold text-indigo-600 border-b-2 border-indigo-300"
                              >
                                {char}
                              </span>
                            ))}
                          {Array.from({
                            length:
                              currentStory.words[idx].length -
                              currentStory.hints[idx].length,
                          }).map((_, blankIdx) => (
                            <input
                              key={`input-${idx}-${blankIdx}`}
                              type="text"
                              maxLength={1}
                              value={(storyAnswers[idx] || "")[blankIdx] || ""}
                              onChange={(e) => {
                                const currentAnswer = storyAnswers[idx] || "";
                                const newAnswer = currentAnswer.split("");
                                newAnswer[blankIdx] =
                                  e.target.value.toLowerCase();
                                setStoryAnswers({
                                  ...storyAnswers,
                                  [idx]: newAnswer.join(""),
                                });

                                // 자동으로 다음 칸으로 이동
                                if (e.target.value) {
                                  const allInputs =
                                    document.querySelectorAll(
                                      'input[type="text"]'
                                    );
                                  const currentInputIndex = Array.from(
                                    allInputs
                                  ).indexOf(e.target);
                                  if (
                                    currentInputIndex <
                                    allInputs.length - 1
                                  ) {
                                    allInputs[currentInputIndex + 1].focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                // 백스페이스로 이전 칸으로 이동
                                const currentAnswer = storyAnswers[idx] || "";
                                if (
                                  e.key === "Backspace" &&
                                  !currentAnswer[blankIdx]
                                ) {
                                  const allInputs =
                                    document.querySelectorAll(
                                      'input[type="text"]'
                                    );
                                  const currentInputIndex = Array.from(
                                    allInputs
                                  ).indexOf(e.target);
                                  if (currentInputIndex > 0) {
                                    allInputs[currentInputIndex - 1].focus();
                                  }
                                }
                              }}
                              className="inline-block w-6 text-center border-b-2 border-indigo-600 focus:border-indigo-800 focus:outline-none bg-white font-bold text-indigo-900"
                              placeholder=" "
                            />
                          ))}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <button
                  onClick={handleMode3Check}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                >
                  정답 확인
                </button>
              </>
            ) : (
              <>
                <div className="bg-gray-50 p-6 rounded-lg mb-6 text-lg leading-relaxed">
                  {storyParts.map((part, idx) => (
                    <React.Fragment key={idx}>
                      {part}
                      {idx < storyParts.length - 1 && (
                        <span
                          className={`inline-flex items-center gap-0 mx-1 ${
                            (
                              currentStory.hints[idx] +
                              (storyAnswers[idx] || "")
                            ).toLowerCase() ===
                            currentStory.words[idx].toLowerCase()
                              ? "bg-green-100 px-1 rounded"
                              : "bg-red-100 px-1 rounded"
                          }`}
                        >
                          {currentStory.hints[idx]
                            .split("")
                            .map((char, charIdx) => (
                              <span
                                key={`hint-${idx}-${charIdx}`}
                                className="inline-block w-6 text-center font-bold text-gray-700"
                              >
                                {char}
                              </span>
                            ))}
                          {currentStory.words[idx]
                            .slice(currentStory.hints[idx].length)
                            .split("")
                            .map((correctChar, blankIdx) => {
                              const userChar =
                                (storyAnswers[idx] || "")[blankIdx] || "";
                              return (
                                <span
                                  key={`answer-${idx}-${blankIdx}`}
                                  className={`inline-block w-6 text-center font-bold ${
                                    userChar.toLowerCase() ===
                                    correctChar.toLowerCase()
                                      ? "text-green-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {userChar || " "}
                                </span>
                              );
                            })}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="font-bold text-lg text-gray-800">
                    정답 및 해설:
                  </h3>
                  {currentStory.words.map((word, idx) => {
                    const fullAnswer =
                      currentStory.hints[idx] + (storyAnswers[idx] || "");
                    const isCorrect =
                      fullAnswer.toLowerCase() === word.toLowerCase();
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          isCorrect
                            ? "bg-green-50 border border-green-300"
                            : "bg-red-50 border border-red-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {isCorrect ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <X size={18} className="text-red-600" />
                          )}
                          <span className="font-semibold">단어 {idx + 1}:</span>
                          <span className="text-indigo-700 font-bold">
                            {word}
                          </span>
                          <span className="text-gray-600">
                            ({currentStory.translations[idx]})
                          </span>
                        </div>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600 ml-6">
                            입력한 답:{" "}
                            <span className="font-medium text-red-600">
                              {fullAnswer || "(미입력)"}
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={resetQuiz}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
                >
                  다시 시작하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default FlashcardApp;
