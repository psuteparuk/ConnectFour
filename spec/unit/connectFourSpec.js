QUnit.module('ConnectFour', function(hooks) {
  hooks.beforeEach(function() {
    this.player1 = new Player({ name: 'Player1', imgUrl: 'http://www.example1.com' });
    this.player2 = new Player({ name: 'Player2', imgUrl: 'http://www.example2.com' });
    this.model = new ConnectFour(this.player1, this.player2);
  });

  QUnit.module('Constructor', function() {
    QUnit.test('Number of rows and columns', function(assert) {
      var model = new ConnectFour(this.player1, this.player2);
      assert.ok((model.row === 6) && (model.col === 7), 'Default row and column');
      model = new ConnectFour(this.player1, this.player2, { row: 10, col: 11 });
      assert.ok((model.row === 10) && (model.col === 11), 'Custom row and column');
    });

    QUnit.test('Players', function(assert) {
      assert.deepEqual(this.model.player1, this.player1, 'Set correct player1');
      assert.deepEqual(this.model.player2, this.player2, 'Set correct player2');
    });

    QUnit.test('Active', function(assert) {
      assert.ok(this.model.isActive, 'Set game state to active');
    });

    QUnit.test('Current Player', function(assert) {
      assert.deepEqual(this.model.currentPlayer, this.player1, 'Default to player1');
    });
  });

  QUnit.module('setCurrentPlayer', function(hooks) {
    hooks.afterEach(function() {
      this.model.setCurrentPlayer(this.player1);
    });

    QUnit.test('Set Correct Player', function(assert) {
      var newPlayer = new Player({ name: 'New Player', imgUrl: 'http://www.example1.com' });
      this.model.setCurrentPlayer(newPlayer);
      assert.deepEqual(this.model.currentPlayer, newPlayer);
    });

    QUnit.test('Trigger playerChanged event', function(assert) {
      assert.expect(1);
      $(this.model).on('playerChanged', function() {
        assert.ok(true, 'playerChanged is triggered!');
      });
    });
  });

  QUnit.module('switchPlayer', function(assert) {
    QUnit.test('Switch to the other player', function(assert) {
      assert.deepEqual(this.model.currentPlayer, this.player1);
      this.model.switchPlayer();
      assert.deepEqual(this.model.currentPlayer, this.player2);
      this.model.switchPlayer();
      assert.deepEqual(this.model.currentPlayer, this.player1);
    });
  });

  QUnit.module('addToken', function(hooks) {
    hooks.afterEach(function() {
      for (var i = 0; i < this.model.col; ++i) {
        this.model.currentState[i].length = 0;
      }
    });

    QUnit.test('Invalid column', function(assert) {
      assert.deepEqual(this.model.addToken(-1), { success: false, error: "Invalid column!" });
      assert.deepEqual(this.model.addToken(this.model.col), { success: false, error: "Invalid column!" });
    });

    QUnit.test('Full column', function(assert) {
      for (var i = 0; i < this.model.row; ++i) {
        this.model.currentState[0].push(1);
      }
      assert.deepEqual(this.model.addToken(0), { success: false, error: "This column is full!" });
    });

    QUnit.test('Add token to currentState and return success', function(assert) {
      var result = this.model.addToken(1);
      assert.deepEqual(result, { success: true, rowIndex: 5 });
      assert.ok(this.model.currentState[1].length === 1);
    });
  });

  QUnit.module('checkWinningState', function(hooks) {
    hooks.afterEach(function() {
      for (var i = 0; i < this.model.col; ++i) {
        this.model.currentState[i].length = 0;
      }
    });

    QUnit.module('North-South', function(hooks) {
      hooks.beforeEach(function() {
        var id1 = this.player1.id;
        var id2 = this.player2.id;
        this.model.currentState[0] = [id1,id1,id1,id1];
        this.model.currentState[1] = [id1,id1,id2,id1,id1];
      });

      QUnit.test('Winning state', function(assert) {
        assert.ok(this.model.checkWinningState(0));
      });

      QUnit.test('Non winning state', function(assert) {
        assert.ok(!this.model.checkWinningState(1));
      });
    });

    QUnit.module('East-West', function(hooks) {
      hooks.beforeEach(function() {
        var id1 = this.player1.id;
        var id2 = this.player2.id;
        this.model.currentState[0] = [id1];
        this.model.currentState[1] = [id1];
        this.model.currentState[2] = [id1];
        this.model.currentState[3] = [id1];
        this.model.currentState[5] = [id1];
      });

      QUnit.test('Winning state', function(assert) {
        assert.ok(this.model.checkWinningState(0));
        assert.ok(this.model.checkWinningState(1));
        assert.ok(this.model.checkWinningState(2));
        assert.ok(this.model.checkWinningState(3));
      });

      QUnit.test('Non winning state', function(assert) {
        assert.ok(!this.model.checkWinningState(5));
      });
    });

    QUnit.module('NorthEast-SouthWest', function(hooks) {
      hooks.beforeEach(function() {
        var id1 = this.player1.id;
        var id2 = this.player2.id;
        this.model.currentState[0] = [id1];
        this.model.currentState[1] = [id2,id1];
        this.model.currentState[2] = [id2,id2,id1];
        this.model.currentState[3] = [id2,id2,id2,id1];
        this.model.currentState[4] = [id1];
      });

      QUnit.test('Winning state', function(assert) {
        assert.ok(this.model.checkWinningState(0));
        assert.ok(this.model.checkWinningState(1));
        assert.ok(this.model.checkWinningState(2));
        assert.ok(this.model.checkWinningState(3));
      });

      QUnit.test('Non winning state', function(assert) {
        assert.ok(!this.model.checkWinningState(4));
      });
    });

    QUnit.module('NorthWest-SouthEast', function(hooks) {
      hooks.beforeEach(function() {
        var id1 = this.player1.id;
        var id2 = this.player2.id;
        this.model.currentState[0] = [id2,id2,id2,id1];
        this.model.currentState[1] = [id2,id2,id1];
        this.model.currentState[2] = [id2,id1];
        this.model.currentState[3] = [id1];
        this.model.currentState[4] = [id1];
      });

      QUnit.test('Winning state', function(assert) {
        assert.ok(this.model.checkWinningState(0));
        assert.ok(this.model.checkWinningState(1));
        assert.ok(this.model.checkWinningState(2));
        assert.ok(this.model.checkWinningState(3));
      });

      QUnit.test('Non winning state', function(assert) {
        assert.ok(!this.model.checkWinningState(4));
      });
    });
  });

  QUnit.module('reset', function() {
    QUnit.test('Reset to default configuration', function(assert) {
      this.model.isActive = false;
      this.model.currentPlayer = this.player2;
      this.model.currentState[0] = [1];
      this.model.currentState[1] = [2];
      this.model.currentState[2] = [1,2];

      this.model.reset();
      assert.ok(this.model.isActive, 'restore isActive');
      assert.deepEqual(this.model.currentPlayer, this.player1, 'set player1 as current');
      for (var i = 0; i < this.model.col; ++i) {
        assert.deepEqual(this.model.currentState[i].length, 0, 'restore initial board state');
      }
    });
  });
});
