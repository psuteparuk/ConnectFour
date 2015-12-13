var ConnectFour = function(player1, player2, options) {
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
