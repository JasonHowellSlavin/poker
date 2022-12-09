import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import TableColumns from "./components/tableColumns";
import PlayerRow from "./components/playerRow";

const pokerData = {
  players: [
    "Jason",
    "Alex",
    "Sap",
    "Brie",
    "Kevin",
    "Kellie",
    "Mike",
    "Meri",
    "Caitlyn",
  ],
  games: [
    "5 Card Draw",
    "7 Card Stud",
    "Texas Hold Em",
    "Omaha Hi Low",
  ],
};

const STARTING_CHIPS = 100;
const ADMIN_MODE = '?admin=true';

function App() {
  const [pokerGameData, setPokerGameData] = useState([]);
  const [winners, setWinners] = useState(["", "", "", ""]);

  // Util Functions 
  const totalRounds = (player) => {
    const total = player.roundTotals.reduce((total, round) => {
      total += parseInt(round);
      return total;
    }, 0);

    return total - player.reBuys * 100;
  };

  const getPlayer = (state, player) => {
    return state.find(
      (currentPlayer) => currentPlayer.playerName === player.playerName
    );
  };

  const isAdminMode = () => {
    const url = new URL(window.location.href); 

    return url.search === ADMIN_MODE
  }

  // Handlers
  const handleInput = (e, player, roundKey) => {
    const stateCopy = pokerGameData.slice();
    const selectedPlayer = getPlayer(stateCopy, player);
    const value = e.currentTarget.value;

    selectedPlayer.roundTotals[roundKey] = value;

    const chipTotals = totalRounds(selectedPlayer);
    selectedPlayer.chipTotal = chipTotals;

    const winner = calculateWinners(stateCopy, roundKey);
    console.log('winner', winner)
    const winnersState = winners;
    winnersState[roundKey] = winner;
    setWinners(winnersState);


    setPokerGameData(stateCopy);
    saveToLocalStorage();
  };

  const handleRebuy = (player) => {
    const stateCopy = pokerGameData.slice();
    const selectedPlayer = getPlayer(stateCopy, player);

    selectedPlayer.reBuys += 1;
    selectedPlayer.chipTotal = totalRounds(player);

    setPokerGameData(stateCopy);
    saveToLocalStorage();
  };

  const handleDataLoad = () => {
    const newState = localStorage.getItem('state');

    setPokerGameData(JSON.parse(newState));
  }

  const calculateWinners = (state, roundIndex) => {
    const playersRoundTotals = state.reduce((totals, player) => {
      totals.push({
        playerName: player.playerName,
        roundTotal: player.roundTotals[roundIndex]
      });
      return totals;
    }, []);

    const sortedPlayersByTotal = playersRoundTotals.sort((playerA, playerB) => {
      if (playerA.roundTotal < playerB.roundTotal) return 1;
      if (playerA.roundTotal > playerB.roundTotal) return -1;
      return 0;
    })

    if (sortedPlayersByTotal[0].roundTotal === sortedPlayersByTotal[1].roundTotal) return '';

    console.log('sorted', sortedPlayersByTotal);

    return sortedPlayersByTotal[0].playerName;
  }

  const saveToLocalStorage = () => {
    const stateCopy = pokerGameData.slice();
    const stringState = JSON.stringify(stateCopy);
    localStorage.setItem('state', stringState);
  }

  useEffect(() => {
    const stateData = [];

    pokerData.players.forEach((player) => {
      stateData.push({
        playerName: player,
        chipTotal: 400,
        reBuys: 0,
        roundTotals: [
          STARTING_CHIPS,
          STARTING_CHIPS,
          STARTING_CHIPS,
          STARTING_CHIPS,
        ],
      });
    });

    setPokerGameData(stateData);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Poker!</p>
        <img alt="poker chip" src="./poker_chip.svg"></img>
      </header>
      <article className="main-stage">
        <p></p>
        <TableColumns data={pokerData.games} />
        {pokerGameData.map((player) => {
          return (
            <>
              <div className="name-and-rebuy">
                <p className="player-name">{player.playerName}</p>
                <button
                  onClick={() => {
                    handleRebuy(player);
                  }}
                >
                  Rebuy
                </button>
                <p>count: {player.reBuys}</p>
              </div>
              <PlayerRow
                player={player}
                handleInput={handleInput}
                roundKey={0}
              />
              <PlayerRow
                player={player}
                handleInput={handleInput}
                roundKey={1}
              />
              <PlayerRow
                player={player}
                handleInput={handleInput}
                roundKey={2}
              />
              <PlayerRow
                player={player}
                handleInput={handleInput}
                roundKey={3}
              />
              <p className="total">Total: <span>{player.chipTotal}</span></p>
            </>
          );
        })}
        <p className="winners-title">Winners --></p>
        <p className="winners">{winners[0]}</p>
        <p className="winners">{winners[1]}</p>
        <p className="winners">{winners[2]}</p>
        <p className="winners">{winners[3]}</p>
        <p></p>
        { isAdminMode() && <div>Admin Tool: 
          <button onClick={() => handleDataLoad()}>Reload Data</button>
        </div>}
      </article>
    </div>
  );
}

export default App;
