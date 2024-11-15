export default function OpenRoomsHeader() {
  return (
    <div className="px-4 flex justify-between items-center mb-2">
      <div>
        <h2 className="text-2xl max-sm:text-lg items-center font-extrabold uppercase">
          STATS:
        </h2>
      </div>
      <div className="flex gap-4 font-bold opacity-70 max-sm:text-sm">
        <div>Pending: 1</div>
        <div>Playing: 4</div>
        <div>Played: 10</div>
      </div>
    </div>
  )
}
