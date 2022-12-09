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
    "Bet Limit 5 Card Draw",
    "Bet Limit 7 Card Stud",
    "No Limit Hold Em",
    "No Limit Omaha Hi Low Split",
  ],
};

const STARTING_CHIPS = 100;
const ADMIN_MODE = '?admin=true';

function App() {
  const [pokerGameData, setPokerGameData] = useState([]);
  const [winners, setWinners] = useState(["", "", "", "", ""]);

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

  const calculateWinners = (roundIndex) => {
    const stateCopy = pokerGameData.slice();

    const playersRoundTotals = stateCopy.reduce((totals, player) => {
      totals.push({
        playerName: player.playerName,
        roundTotal: player.roundTotals[roundIndex]
      });
      return totals;
    }, []);

    console.log(playersRoundTotals);

    const sortedPlayersByTotal = playersRoundTotals.sort((playerA, playerB) => {
      if (playerA.roundTotal < playerB.roundTotal) return 1;
      if (playerB.roundTotal > playerB.roundTotal) return -1;
      return 0;
    })

    console.log(sortedPlayersByTotal, 'sortedPlayersByTotal');

    // if (sortedPlayersByTotal[0].roundTotal === sortedPlayersByTotal[1].roundTotal) return '';

    // return sortedPlayersByTotal[0].plaerName;

    // Here we fill in the winners circle
  }

  const saveToLocalStorage = () => {
    const stateCopy = pokerGameData.slice();

    const stringState = JSON.stringify(stateCopy);
    console.log('saving', stringState);
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
      </header>
      <article className="main-stage">
        <p></p>
        <TableColumns data={pokerData.games} />
        {pokerGameData.map((player) => {
          return (
            <>
              <div>
                <p>{player.playerName}</p>
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
              <p>Total: {player.chipTotal}</p>
            </>
          );
        })}
        <p>Winners</p>
        <p>{calculateWinners(0)}</p>
        <p>{calculateWinners(1)}</p>
        <p>{calculateWinners(2)}</p>
        <p>{calculateWinners(3)}</p>
        <p></p>
        { isAdminMode() && <div>Admin Tool: 
          <button onClick={() => handleDataLoad()}>Reload Data</button>
        </div>}
      </article>
    </div>
  );
}

export default App;
