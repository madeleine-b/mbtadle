import mbtaAnswers from './../data/mbta/answers.json';
import mbtaSolutions from './../data/mbta/solutions.json';
import mbtaRoutings from './../data/mbta/routings.json';
import transfers from './../data/transfers.json';

const GAME_EPOCH = new Date('November 23, 2023 00:00:00').valueOf();
const DEKALB_AV_FLATBUSH_STOP = "R30";

const today = new Date();
const now = Date.now();

const isSimilarToAnswerTrain = (guess, index) => {
  let begin;
  let end;
  const answer = todaysTrip()[index];
  const solution = todaysTripInLines();
  // FIXME


  return false;
}

export const routesWithNoService = () => {
  return [];
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

const todaysTripInLines = () => {
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
