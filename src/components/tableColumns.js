export default function TableColumns({data}) {
    return (
        <>
            {data.map((title) => <p>{title}</p>)}
            <p></p>
        </>
    )
}