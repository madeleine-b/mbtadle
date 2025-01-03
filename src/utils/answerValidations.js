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
  const routesThatExist = ['GLE-OL-BL', 'OL-BL-GLD', 'GLD-OL-GLE', 'GLD-OL-RLB', 'OL-RLA-GLE', 'BL-OL-GLE', 'GLD-OL-BL', 'GLE-RLB-OL', 'OL-RLA-GLC', 'OL-RLB-GLE', 'OL-RLB-GLB', 'RLA-GLD-BL', 'RLA-OL-GLE', 'BL-GLE-RLA', 'GLE-RLA-OL', 'GLB-BL-OL', 'OL-RLB-GLC', 'RLB-OL-GLE', 'OL-GLD-BL', 'GLC-RLB-OL', 'GLE-RLA-RLM', 'OL-GLE-BL', 'RLA-GLD-OL', 'GLD-RLA-RLM', 'OL-BL-GLC', 'OL-GLE-RLB', 'RLM-RLA-OL', 'OL-GLD-OL', 'RLA-GLE-BL', 'RLA-GLC-BL', 'GLE-OL-RLB', 'OL-RLB-GLD', 'RLM-RLA-GLE', 'OL-BL-GLB', 'RLB-OL-BL', 'RLA-GLB-BL', 'BL-OL-RLA', 'OL-GLD-RLB', 'GLD-RLB-OL', 'BL-GLD-OL', 'GLE-BL-OL', 'GLC-RLA-RLM', 'OL-GLE-OL', 'OL-GLD-RLA', 'GLB-RLA-OL', 'RLB-OL-GLD', 'GLC-BL-OL', 'GLD-OL-RLA', 'RLB-GLE-BL', 'GLD-BL-OL', 'BL-GLB-RLB', 'GLE-OL-GLD', 'RLA-OL-BL', 'BL-GLD-RLB', 'RLM-RLA-GLD', 'GLB-RLA-RLM', 'BL-OL-RLB', 'OL-RLA-GLB', 'GLD-RLA-OL', 'BL-OL-GLD', 'RLM-RLA-GLC', 'OL-RLA-RLM', 'GLB-RLB-OL', 'BL-GLE-OL', 'BL-GLB-RLA', 'GLC-RLA-OL', 'RLB-GLD-BL', 'GLE-OL-RLA', 'RLB-GLC-BL', 'RLB-GLE-OL', 'BL-GLC-RLA', 'BL-GLD-RLA', 'RLB-GLD-OL', 'BL-GLC-RLB', 'RLA-GLE-OL', 'RLB-GLB-BL', 'RLA-OL-GLD', 'OL-RLA-GLD', 'RLM-RLA-GLB', 'GLD-OL-GLD', 'BL-GLE-RLB', 'OL-BL-GLE', 'GLE-OL-GLE', 'OL-GLE-RLA'];
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
  // this is weird and less than ideal. at the start of the day we will randomly choose one of the possible
  // routings in the case more than one goes through with the exact same stations (RLB and RLA e.g.)
  // we keep around all possible routings for checking validity
  const numSolns = todaysSolution()["solution"].length;
  const chosenIndex = todayGameIndex() % numSolns;
  return todaysSolution()["solution"][chosenIndex].split("-");
}

export const flattenedTodaysTrip = () => {
  return todaysTrip().join('-');
}

export const todaysSolution = () => {
  return mbtaSolutions[todaysTrip().join("-")];
}

export const isWinningGuess = (guess) => {
  return guess.join('-') === todaysTripInLines().join('-');
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
