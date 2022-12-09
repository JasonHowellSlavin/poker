export default function PlayerRow({player, handleInput, handleRebuy, roundKey}) {
    return (
        <>
            <input type='number' className="chips" value={player.roundTotals[roundKey]} onChange={(e) => {handleInput(e, player, roundKey)}}></input> 
       </>
    );
}