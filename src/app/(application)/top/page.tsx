export default async function Top() {
    return (
        <main className="w-full flex flex-col grow items-center">
            <h1 className="text-2xl font-bold pt-2 pb-4">Top Movies</h1>
            <div className="w-11/12 border border-white h-[250px] flex justify-center items-center">
                Test
            </div>
            <div className="w-11/12 border border-white flex grow justify-between items-center">
                <div className="h-[200px] flex justify-center items-center border border-white w-[160]">
                    Comedy
                </div>
                <div className="h-[200px] flex justify-center items-center border border-white w-[160]">
                    Action
                </div>
                <div className="h-[200px] flex justify-center items-center border border-white w-[160]">
                    Romance
                </div>
            </div>
        </main>
    )
}
