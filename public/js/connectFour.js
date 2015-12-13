var ConnectFour = function(options) {
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

ConnectFour.prototype.addToken = function(colIndex, playerID) {
  if (colIndex < 0 || colIndex >= this.col) {
    return { success: false, error: "Invalid column!" };
  } else if (this.currentState[colIndex].length === this.row) {
    return { success: false, error: "This column is full!" };
  } else {
    this.currentState[colIndex].push(playerID);
    return { success: true, rowIndex: this.row - this.currentState[colIndex].length };
  }
};

ConnectFour.prototype.checkWinningState = function() {};
