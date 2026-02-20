import { NextResponse } from "next/server"

export async function GET() {
    const key = process.env.STEAM_API_KEY

    // try with my steam id
    const steamId = '76561199082107276'
    // game id
    const appID = '220'
    

    // urls
    const urlPlayerSummary = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamId}`

    const urlPlayerGameStats = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appID}&key=${key}&steamid=${steamId}`

    const urlOwnedGames = ` http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${key}&steamid=${steamId}=json`

    // get api
    try {
        const res = await fetch(urlPlayerGameStats, {
            next: {
                revalidate: 3600 // cache for 1 hr
            }
        });
        const data = await res.json()

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ err: 'Failed to fetch data' }, { status: 404 })
    }
}