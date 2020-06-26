const constants = require("./constants");

const generateUuid = () => {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

const randomItemFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

const nRandomItemsFromArray = (n, array) => {
  return [...array].sort(() => 0.5 - Math.random()).slice(0, n);
};

const generatePlayer = (name, existingPlayers) => {
  const availableColors = constants.colors.filter(
    (color) => !existingPlayers.map((player) => player.color).includes(color)
  );
  const color = randomItemFromArray(availableColors);
  return {
    name,
    uuid: generateUuid(),
    score: 0,
    color,
  };
};

module.exports = {
  generatePlayer,
  randomItemFromArray,
  nRandomItemsFromArray,
};
