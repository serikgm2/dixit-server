const utils = require("./utils");
const constants = require("./constants");

const initGameState = {
  allCards: constants.cards.map((card) => ({ src: card, selected: false })), //84
  playedCards: [],
  selectedCards: [],
  players: [],
  storyState: {
    storyCard: null,
    playedCards: [],
  },
  started: false,
  storyGiven: false,
};

let gameState = {
  ...initGameState,
};

const addPlayer = (name) => {
  const newPlayer = utils.generatePlayer(name, gameState.players);
  gameState = {
    ...gameState,
    players: [...gameState.players, newPlayer],
    currentPlayer: newPlayer,
  };
  return newPlayer;
};

const startGame = (uuid) => {
  if (!gameState.started) {
    const players = gameState.players
      .map((player) => ({
        ...player,
        storyTeller: player.uuid === uuid,
        actionRequired: player.uuid === uuid,
      }))
      .reduce((acc, player) => {
        const playersCards = acc.reduce(
          (a, player) => [...a, ...player.myCards.map((card) => card.src)],
          []
        );
        const availableCards = gameState.allCards.filter(
          (card) => !playersCards.includes(card.src)
        );
        const myCards = utils.nRandomItemsFromArray(4, availableCards);
        return [...acc, { ...player, myCards }];
      }, []);
    gameState = {
      ...gameState,
      players,
      started: true,
    };
  }
};

const startStory = ({ uuid, selectedCard }) => {
  gameState = {
    ...gameState,
    players: gameState.players.map((player) => {
      return player.uuid !== uuid
        ? { ...player, actionRequired: true }
        : {
            ...player,
            myCards: player.myCards.filter(
              (card) => card.src !== selectedCard.src
            ),
            actionRequired: false,
            playedStory: true,
          };
    }),
    storyState: {
      ...gameState.storyState,
      playedCards: [
        ...gameState.storyState.playedCards,
        { ...selectedCard, selected: false },
      ],
      storyCard: { ...selectedCard, selected: false },
    },
    storyGiven: true,
  };
};

const playStory = ({ uuid, selectedCard }) => {
  const allPlayed =
    gameState.players.filter((player) => player.playedStory).length ===
    gameState.players.length - 1;
  gameState = {
    ...gameState,
    players: gameState.players.map((player) => {
      return player.uuid === uuid
        ? {
            ...player,
            actionRequired: allPlayed || false,
            playedStory: true,
            myCards: player.myCards.filter(
              (card) => card.src !== selectedCard.src
            ),
          }
        : {
            ...player,
            actionRequired: allPlayed || player.actionRequired,
          };
    }),
    storyState: {
      ...gameState.storyState,
      playedCards: [
        ...gameState.storyState.playedCards,
        { ...selectedCard, selected: false },
      ].sort(),
    },
    storyGiven: true,
  };
};

const guessStoryCard = ({ uuid, selectedCard }) => {
  gameState = {
    ...gameState,
    players: gameState.players.map((player) => {
      return player.uuid === uuid
        ? {
            ...player,
            actionRequired: false,
            guessed: true,
          }
        : { ...player };
    }),
    storyState: {
      ...gameState.storyState,
    },
  };
};

const setToInitState = () => {
  gameState = {
    ...initGameState,
  };
};

module.exports = {
  getGameState: () => gameState,
  getPlayer: (uuid) =>
    gameState.players.filter((player) => player.uuid === uuid)[0],
  addPlayer,
  startGame,
  startStory,
  playStory,
  guessStoryCard,
  setToInitState,
};
