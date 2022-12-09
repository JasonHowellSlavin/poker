export default function TableColumns({data}) {
    return (
        <>
            {data.map((title) => <p className="column-title">{title}</p>)}
            <p></p>
        </>
    )
}