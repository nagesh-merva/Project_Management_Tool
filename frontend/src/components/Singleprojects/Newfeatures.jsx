const Newfeatures = ({ feature, dsc }) => {
    return (
        <div className="h-1/4 w-auto my-2 mx-3 rounded-lg border-2 border-gray-400 flex ">
            <input id="one" type="checkbox" value="" className="w-4 h-4 m-8 mr-0 dark:ring-offset-gray-800 focus:ring-2 " />
            <label for="one" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"></label>
            <div className="ml-7 mr-4">
                <p className="text-base font-sans font-semibold ">{feature}</p>
                <p className="text-base font-sans font-thin text-gray-500 mb-2">{dsc}</p>
            </div>
        </div>
    )
}
export default Newfeatures