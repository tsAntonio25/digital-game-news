import Image from "next/image"
import { SteamGame } from "./model/SteamGame/steamgame"
import { Profile } from "./model/Profile/profile"
import Link from "next/link"

// get current games
async function getGames() {
  // fetch 
  const res = await fetch('http://localhost:3000/api/games',
    { next: { revalidate: 0 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.response?.games || []
}

// get profile
async function getProfile() {
  // fetch
  const res = await fetch('http://localhost:3000/api/profile',
    { next: { revalidate: 3600 } })
  
  if (!res.ok) return null
  const data = await res.json()
  return data.response?.players?.[0] || null
}

// get friends data
async function getFriends() {
  const res = await fetch('http://localhost:3000/api/friends',
    { next: { revalidate: 3600 } })
  
  if (!res.ok) return []
  const data = await res.json()

  if (data.response?.players) return data.response.players;
  return data || []
}

export default async function AllGames() {
  // get data
  const gameData = await getGames()
  const player = await getProfile()
  const friends = await getFriends()

  // sort
  const games = [...gameData].sort((a: SteamGame, b: SteamGame) => {
    return a.name.localeCompare(b.name)
  })

  return (
    // container
    <main className="min-h-screen bg-[#1b2838] text-[#c6d4df] p-6 font-sans">
      
      <nav className="flex flex-row items-center text-[#c6d4df] hover:text-sky-500 border">
        <Link href="/news">News</Link> 
    </nav>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 mb-5 bg-[#171a21] p-8 rounded shadow-2xl border-l-4 border-sky-500">
        <div className="relative group">
          <Image
            src={player.avatarfull}
            width={164}
                height={164}
                loading="eager"
            alt="Profile"
            className="rounded-sm border-2 border-stone-600 group-hover:border-sky-400 transition-colors"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">{player.personaname}</h1>
              <div className="mt-4">
                <a 
                  href={player.profileurl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#171a21] hover:bg-[#2a475e] text-[#c7d5e0] hover:text-white border border-[#3d4450] rounded-sm transition-all duration-200 text-sm font-medium group"
                >
                  <svg className="w-4 h-4 text-sky-500 group-hover:text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 1.253.192 2.46.548 3.596l5.225 2.147a4.1 4.1 0 0 1 3.511-.645l2.458-3.522a4.093 4.093 0 0 1 1.776-6.425V7.125a4.116 4.116 0 0 1 2.924-4.137l.001.002c.038-.01.076-.021.114-.029a4.113 4.113 0 0 1 4.966 3.965v.001c0 .034-.002.068-.004.101a4.114 4.114 0 0 1-3.69 3.737v2.441a4.1 4.1 0 0 1 5.311 3.968c0 1.348-.65 2.545-1.65 3.292l.002.001c-.131.1-.267.193-.41.28a4.112 4.112 0 0 1-5.741-.954l-3.514-1.293a4.116 4.116 0 0 1-3.666.906l-2.14 5.234A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                  View Steam Profile
                </a>
              </div>
        </div>
      </div>

    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-2 flex flex-col">
        <h2 className="text-xl uppercase tracking-widest text-white mb-4 border-b border-stone-700 pb-2">
          All Games
        </h2>
        
          <div className="flex flex-col gap-4 max-h-150 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2
    [&::-webkit-scrollbar-track]:bg-[#171a21]/60
  [&::-webkit-scrollbar-thumb]:bg-[#171a21]/60
  dark:[&::-webkit-scrollbar-track]:bg-[#171a21]/60
  dark:[&::-webkit-scrollbar-thumb]:bg-sky-400">
          {games.map((game: SteamGame) => (
            <div 
              key={game.appid} 
              className="flex items-center gap-4 bg-[#171a21]/60 p-4 rounded-sm border border-transparent hover:border-sky-500 transition-all group"
            >
              <div className="shrink-0 w-32">
                <Image
                  src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                  width={460}
                  height={215}
                  alt={game.name}
                  className="rounded-sm"
                />
              </div>
              <div className="grow">
                <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
                  {game.name}
                </h3>
                <p className="text-stone-500 text-sm uppercase">
                  {Math.round(game.playtime_forever / 60)} Hours Played
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl uppercase tracking-widest text-white mb-4 border-b border-stone-700 pb-2">
          Friend List
        </h2>
        
        <div className="flex flex-col gap-2 max-h-150 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-[#171a21]/60
  [&::-webkit-scrollbar-thumb]:bg-[#171a21]/60
  dark:[&::-webkit-scrollbar-track]:bg-[#171a21]/60
  dark:[&::-webkit-scrollbar-thumb]:bg-sky-400">
          {friends.map((friend: Profile) => (
            <div 
              key={friend.steamid} 
              className="flex items-center gap-3 bg-[#171a21]/60 p-2 rounded-sm border border-transparent hover:border-sky-500 transition-all group"
            >
              <div className="relative shrink-0">
                <Image
                  src={friend.avatar}
                  width={40}
                  height={40}
                  alt={friend.personaname}
                  className="rounded-full border border-stone-600"
                />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#171a21] ${friend.personastate > 0 ? 'bg-green-500' : 'bg-stone-500'}`} />
              </div>
              <div className="grow overflow-hidden">
                <h3 className="text-sm font-medium text-[#c6d4df] truncate group-hover:text-sky-400">
                  {friend.personaname}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
</main>
  );
}