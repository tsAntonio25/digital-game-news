import { NextResponse } from "next/server"
import { CONFIG } from "../../lib/config"

export async function GET() {
    // url for games
    const getProfile = `${CONFIG.BASE_URL}ISteamUser/GetPlayerSummaries/v0002/?key=${CONFIG.API_KEY}&steamids=${CONFIG.STEAM_ID}`

    // get api
    try {
        const res = await fetch(getProfile, {
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
    
