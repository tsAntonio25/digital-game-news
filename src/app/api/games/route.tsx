import { NextResponse } from "next/server"
import { CONFIG } from "../../lib/config"

export async function GET() {
    // url for games
    const getGames = `${CONFIG.BASE_URL}IPlayerService/GetOwnedGames/v0001/?key=${CONFIG.API_KEY}&steamid=${CONFIG.STEAM_ID}&include_appinfo=1&include_played_free_games=1&format=json`

    // get api
    try {
        const res = await fetch(getGames, {
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
    
