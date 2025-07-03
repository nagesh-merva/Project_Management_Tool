const Newfin = ({ head, amount, ap, color, textColor }) => {
    return (

        <div className={`w-[328.36px] h-[124px] p-5 rounded-lg  ${color}`}>
            <h1 className={`${textColor}`}>{head} </h1>
            <div className=" font-bold text-xl">{amount}</div>
            <p className={`${textColor}`}>{ap}</p>
        </div>

    )
}
export default Newfin

