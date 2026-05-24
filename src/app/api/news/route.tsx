import { NextResponse } from "next/server"
import { CONFIG } from "../../lib/config"

export async function GET() {
    // get one game and its latest 5 news
    const getNews = `${CONFIG.BASE_URL}ISteamNews/GetNewsForApp/v0002/?appid=2161700&count=5&maxlength=300&format=json`

    // get api
    try {
        const res = await fetch(getNews, {
            next: {
                revalidate: 3600
            }
        })
        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        return NextResponse.json({err: "Failed to fetch data"}, {status: 404})
    }


    /* 
    
        NOTE:

        - only gets 1 game.
        - get atleast 5 recently played games and display 3 latest news each

    
    
    */
}