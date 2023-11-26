import mbtaAnswers from './../data/mbta/answers.json';
import mbtaSolutions from './../data/mbta/solutions.json';
import mbtaRoutings from './../data/mbta/routings.json';
import transfers from './../data/transfers.json';

const GAME_EPOCH = new Date('November 24, 2023 00:00:00').valueOf();

const today = new Date();
const now = Date.now();

const isSimilarToAnswerTrain = (guess, index) => {
  let begin;
  let end;
  const solution = todaysSolution();
  const answer = todaysTripInLines()[index];

  switch (index) {
    case 0:
      begin = solution.origin;
      end = solution.first_transfer_arrival;
      break;
    case 1:
      begin = solution.first_transfer_departure;
      end = solution.second_transfer_arrival;
      break;
    default:
      begin = solution.second_transfer_departure;
      end = solution.destination;
  }

  begin = removeGLNonsense([begin])[0]
  end = removeGLNonsense([end])[0]

  const guessSubrouting = retrieveSubrouting(guess, mbtaRoutings, begin, end);

  if (!guessSubrouting) {
    return false;
  }

  const answerSubrouting = retrieveSubrouting(answer, mbtaRoutings, begin, end);

  const guessSubroutingInner = guessSubrouting.slice(1, guessSubrouting.length);
  const answerSubroutingInner = answerSubrouting.slice(1, answerSubrouting.length);

  if (guessSubroutingInner.every(s => answerSubroutingInner.includes(s)) || answerSubroutingInner.every(s => guessSubroutingInner.includes(s))) {
    return (guessSubrouting.includes(begin) && answerSubrouting.includes(begin)) || (guessSubrouting.includes(end) && answerSubrouting.includes(end));
  }

  return false;
}

const removeGLNonsense = (routeArr) => {
  return routeArr.map(s => s.replace(" (GL-E)", "").replace(" (GL-D)", "").replace(" (GL-C)", "").replace(" (GL-B)", ""));
}

const retrieveSubrouting = (train, routings, begin, end) => {
  const generalRoutingsForTrain = removeGLNonsense(routings[train]);

  const beginIndex = removeGLNonsense([begin, transfers[begin]].flat().filter(n => n)).map(s => generalRoutingsForTrain.indexOf(s)).find(i => i > -1);
  const endIndex = removeGLNonsense([end, transfers[end]].flat().filter(n => n)).map(s => generalRoutingsForTrain.indexOf(s)).find(i => i > -1);

  if (beginIndex == null || endIndex == null) {
    return;
  }

  if (beginIndex < endIndex) {
    return generalRoutingsForTrain.slice(beginIndex, endIndex + 1);
  }
  return generalRoutingsForTrain.slice(endIndex, beginIndex + 1);
}

export const isValidGuess = (guess) => {
  const flattenedGuess = guess.join('-');
  const routesThatExist = Object.values(mbtaSolutions).map((sol) => { return sol['solution']; });
  return routesThatExist.includes(flattenedGuess);
}

export const todayGameIndex = () => {
  return Math.floor(daysBetween(GAME_EPOCH, now));
}

const treatAsUTC = (date) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

const daysBetween = (startDate, endDate) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

const todaysRoutings = () => {
  return mbtaRoutings;
}

export const todaysTrip = () => {
  const index = todayGameIndex();
  return mbtaAnswers[index % mbtaAnswers.length];
}

export const todaysTripInLines = () => {
  return todaysSolution()["solution"].split("-");
}

export const flattenedTodaysTrip = () => {
  return todaysTrip().join('-');
}

export const todaysSolution = () => {
  return mbtaSolutions[todaysTrip().join("-")];
}

export const isWinningGuess = (guess) => {
  return guess.join('-') === todaysSolution()["solution"];
}

export const updateGuessStatuses = (guesses, setCorrectRoutes, setSimilarRoutes, setPresentRoutes, setAbsentRoutes, setSimilarRoutesIndexes, correctRoutes, similarRoutes, presentRoutes, absentRoutes, similarRoutesIndexes) => {
  const correct = correctRoutes || [];
  let similar = similarRoutes || [];
  const present = presentRoutes || [];
  const absent = absentRoutes || [];
  const similarIndexes = similarRoutesIndexes || {};

  guesses.forEach((guess) => {
    const remainingRoutes = [];
    const remainingGuessPositions = [];

    todaysTripInLines().forEach((routeId, index) => {
      if (guess[index] === routeId) {
        correct.push(routeId);
        Object.keys(similarIndexes).forEach((r) => {
          const s = similarIndexes[r];
          if (s.includes(index)) {
            similarIndexes[r] = s.filter(t => t !== index);
            if (similarIndexes[r].length === 0) {
              delete similarIndexes[r];
              similar = similar.filter(t => t !== r);
            }
          }
        })
      } else {
        remainingRoutes.push(routeId);
        remainingGuessPositions.push(index);

        if (isSimilarToAnswerTrain(guess[index], index)) {
          similar.push(guess[index]);
          if (similarIndexes[guess[index]] && !similarIndexes[guess[index]].includes(index)) {
            similarIndexes.push(index);
          } else if (!similarIndexes[guess[index]]) {
            similarIndexes[guess[index]] = [index];
          }
        }
      }
    });

    remainingGuessPositions.forEach((index) => {
      if (remainingRoutes.includes(guess[index])) {
        present.push(guess[index]);
      } else {
        absent.push(guess[index]);
      }
    });
  });

  setCorrectRoutes(correct);
  setSimilarRoutes(similar);
  setPresentRoutes(present);
  setAbsentRoutes(absent);
  setSimilarRoutesIndexes(similarIndexes);
}

export const checkGuessStatuses = (guess) => {
  const results = ['absent', 'absent', 'absent'];
  const remainingRoutes = [];
  const remainingGuessPositions = [];

  todaysTripInLines().forEach((routeId, index) => {
    if (guess[index] === routeId) {
      results[index] = 'correct';
    } else {
      remainingRoutes.push(routeId);
      remainingGuessPositions.push(index);
      if (isSimilarToAnswerTrain(guess[index], index)) {
        results[index] = 'similar';
      }
    }
  });

  remainingGuessPositions.forEach((index) => {
    if (remainingRoutes.includes(guess[index])) {
      results[index] = 'present';
    }
  });

  return results;
}
