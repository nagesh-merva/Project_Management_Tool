const FinanceDataBox = ({ head, amount, ap, color, textColor }) => {
    return (

        <div className={`basis-1/3 h-[124px] p-5 rounded-lg  ${color}`}>
            <h1 className={`${textColor}`}>{head} </h1>
            <div className=" font-bold text-xl">{amount}</div>
            <p className={`${textColor}`}>{ap}</p>
        </div>

    )
}
export default FinanceDataBox

