import React, { useEffect, useContext } from "react";
import { MatchContext } from "../Match";
import AuthenticationContext from "../Authentication";
import FirebaseContext from "../FirebaseContext";
import { gameover } from "./functions";
import * as CONSTANTS from "../../Constants";
import {
  getRandomFirstTurn,
  bothPlayersAreReady,
  toggleReady
} from "../../Functions";

import "./index.css";

const RematchContainer = () => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { matchId, value } = useContext(MatchContext);
  const { board, players, gameState } = value;

  useEffect(() => {
    console.log("Starting rematch");
    const thisPlayer = players.find(player => player.uid === user.uid);
    if (
      bothPlayersAreReady(players) &&
      gameState === CONSTANTS.GAME_STATE_GAMEOVER &&
      thisPlayer.host
    ) {
      const nextPlayersState = players.map(player => ({
        ...player,
        ready: false
      }));
      const turn = getRandomFirstTurn(nextPlayersState);
      firebase
        .firestore()
        .collection("matches")
        .doc(matchId)
        .update({
          gameState: CONSTANTS.GAME_STATE_PLAYING,
          board: [null, null, null, null, null, null, null, null, null],
          players: nextPlayersState,
          turn
        });
    }
  }, [firebase, user, board, players, gameState, matchId]);

  if (gameover(board).gameover) {
    return (
      <RematchView
        players={players}
        toggleReady={async () => await toggleReady(firebase, user, matchId)}
      />
    );
  }
  return null;
};

const RematchView = ({ players, toggleReady }) => (
  <div>
    <div>Rematch?</div>
    {players.map(player => (
      <RematchQuestionContainer
        key={player.uid}
        player={player}
        toggleReady={toggleReady}
      />
    ))}
  </div>
);

const RematchQuestionContainer = ({ player, toggleReady }) => {
  const { user } = useContext(AuthenticationContext);

  return (
    <div>
      <div>{player.isAnonymous ? "Anon" : player.displayName}</div>
      {user.uid === player.uid ? (
        <button type="button" onClick={toggleReady}>
          {player.ready ? "Cancel" : "Ready up"}
        </button>
      ) : (
        <div>{player.ready ? "Ready" : "Not Ready"}</div>
      )}
    </div>
  );
};

const GameboardContainer = () => {
  return (
    <div>
      <TurnContainer />
      <GameboardView />
      <RematchContainer />
    </div>
  );
};

const GameboardView = () => (
  <div>
    <div className="board-row">
      <SquareContainer index={0} />
      <SquareContainer index={1} />
      <SquareContainer index={2} />
    </div>
    <div className="board-row">
      <SquareContainer index={3} />
      <SquareContainer index={4} />
      <SquareContainer index={5} />
    </div>
    <div className="board-row">
      <SquareContainer index={6} />
      <SquareContainer index={7} />
      <SquareContainer index={8} />
    </div>
  </div>
);

const SquareContainer = ({ index }) => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(AuthenticationContext);
  const { uid } = user;
  const { matchId, value } = useContext(MatchContext);
  const { board, gameState, players } = value;
  const gameoverState = gameover(board);

  if (gameoverState.gameover && gameState !== CONSTANTS.GAME_STATE_GAMEOVER) {
    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        gameState: CONSTANTS.GAME_STATE_GAMEOVER
      });
  }

  function onClick() {
    if (board[index] || value.turn !== uid || gameoverState.gameover) {
      return;
    }

    const nextBoardState = value.board.map((square, squareIndex) => {
      if (squareIndex === index) {
        return uid;
      }
      return square;
    });

    const nextTurnState = value.players.find(player => player.uid !== uid).uid;

    firebase
      .firestore()
      .collection("matches")
      .doc(matchId)
      .update({
        board: nextBoardState,
        turn: nextTurnState
      });
  }

  return (
    <SquareView
      index={index}
      winningSet={gameoverState.winningSet}
      onClick={onClick}
      mark={board[index]}
      players={players}
    />
  );
};
const SquareView = ({ index, winningSet, onClick, mark, players }) => (
  <button
    style={{
      color: winningSet.includes(index) ? "red" : "black"
    }}
    type="button"
    className="square"
    onClick={onClick}
  >
    {getSquareMark(mark, players)}
  </button>
);

function getSquareMark(mark, players) {
  if (!mark) {
    return "";
  }

  return getMark(mark, players);
}

function getMark(mark, players) {
  return players.find(player => player.uid === mark).mark;
}

const TurnContainer = () => {
  const { user } = useContext(AuthenticationContext);
  const { uid } = user;
  const { value } = useContext(MatchContext);
  const { turn } = value;

  return (
    <TurnView
      gameoverState={gameover(value.board)}
      isPlayersTurn={uid === turn}
    />
  );
};

const TurnView = ({ gameoverState, isPlayersTurn }) => (
  <div>
    {gameoverState.gameover ? (
      <GameoverMessage winner={gameoverState.winner} />
    ) : isPlayersTurn ? (
      "Your turn"
    ) : (
      "Opponent's turn"
    )}
  </div>
);

const GameoverMessage = ({ winner }) => {
  const { user } = useContext(AuthenticationContext);
  const { value } = useContext(MatchContext);
  const { players } = value;
  const opponent = players.find(player => player.uid !== user.uid);

  if (winner) {
    return (
      <div>
        {winner === user.uid
          ? "You win!"
          : `${opponent.isAnonymous ? "Anon" : opponent.displayName} Wins`}
      </div>
    );
  }
  return <div>Tie!</div>;
};

export default GameboardContainer;
