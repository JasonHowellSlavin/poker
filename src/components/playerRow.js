export default function PlayerRow({player, handleInput, handleRebuy, roundKey}) {
    return (
        <>
            <input type='number' value={player.roundTotals[roundKey]} onChange={(e) => {handleInput(e, player, roundKey)}}></input> 
       </>
    );
}