var ConnectFour = function(player1, player2, options) {
  this.TARGET_LENGTH = 4;

  this.player1 = player1;
  this.player2 = player2;
  this.currentPlayer = this.player1;

  options = options || {};
  this.row = options.row || 6;
  this.col = options.col || 7;
  this.title = options.title || 'ConnectFour';
  this.isActive = true;

  /* Store the tokens config. currentState[i][j] represents the state of the jth row and ith column.
   * 0 = empty, and number d = player-d's token.
   */
  this.currentState = [];
  for (var col = 0; col < this.col; ++col) {
    this.currentState.push([]);
  }
};

ConnectFour.prototype.setCurrentPlayer = function(player) {
  this.currentPlayer = player;
  $(this).trigger('playerChanged', [this.currentPlayer]);
};

ConnectFour.prototype.switchPlayer = function() {
  if (this.currentPlayer.id === 1) this.setCurrentPlayer(this.player2);
  else this.setCurrentPlayer(this.player1);
};

ConnectFour.prototype.addToken = function(colIndex) {
  if (colIndex < 0 || colIndex >= this.col) {
    return { success: false, error: "Invalid column!" };
  } else if (this.currentState[colIndex].length === this.row) {
    return { success: false, error: "This column is full!" };
  } else {
    this.currentState[colIndex].push(this.currentPlayer.id);
    return { success: true, rowIndex: this.row - this.currentState[colIndex].length };
  }
};

ConnectFour.prototype.checkWinningState = function(colIndex) {
  var playerID = this.currentPlayer.id;
  var rowIndex = this.currentState[colIndex].length - 1;
  var rInd, cInd;
  var count;

  // Up-Down (can only have down)
  count = 1;
  rInd = rowIndex;
  while (--rInd >= 0 && count < this.TARGET_LENGTH) {
    if (this.currentState[colIndex][rInd] === playerID) count++;
    else break;
  }
  if (count === this.TARGET_LENGTH) return true;

  // Left-Right
  count = 1;
  cInd = colIndex;
  while (--cInd >= 0 && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rowIndex) break; // no token
    if (this.currentState[cInd][rowIndex] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;
  cInd = colIndex;
  while (++cInd < this.col && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rowIndex) break; // no token
    if (this.currentState[cInd][rowIndex] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;

  // NE-SW
  count = 1;
  rInd = rowIndex;
  cInd = colIndex;
  while (--rInd >= 0 && --cInd >= 0 && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rInd) break; // no token
    if (this.currentState[cInd][rInd] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;
  rInd = rowIndex;
  cInd = colIndex;
  while (++rInd < this.row && ++cInd < this.col && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rInd) break; // no token
    if (this.currentState[cInd][rInd] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;

  // NW-SE
  count = 1;
  rInd = rowIndex;
  cInd = colIndex;
  while (--rInd >= 0 && ++cInd < this.col && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rInd) break; // no token
    if (this.currentState[cInd][rInd] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;
  rInd = rowIndex;
  cInd = colIndex;
  while (++rInd < this.row && --cInd >= 0 && count < this.TARGET_LENGTH) {
    if (this.currentState[cInd].length <= rInd) break; // no token
    if (this.currentState[cInd][rInd] !== playerID) break; // wrong token
    count++;
  }
  if (count === this.TARGET_LENGTH) return true;

  return false;
};

ConnectFour.prototype.reset = function() {
  this.setCurrentPlayer(this.player1);
  this.isActive = true;

  for (var i = 0; i < this.col; ++i) {
    this.currentState[i].length = 0;
  }
};
