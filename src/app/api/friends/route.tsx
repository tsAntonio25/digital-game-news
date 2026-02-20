import { NextResponse } from "next/server"
import { CONFIG } from "../../lib/config"
import { Friend } from "../../model/Friend/friend"

export async function GET() {
    const getFriends = `${CONFIG.BASE_URL}ISteamUser/GetFriendList/v0001/?key=${CONFIG.API_KEY}&steamid=${CONFIG.STEAM_ID}&relationship=friend`

    try {
    const frndsResponse = await fetch(getFriends, { cache: 'no-store' });
    const frndsidData = await frndsResponse.json();
    const friendsArray = frndsidData.friendslist?.friends || [];
    
    if (friendsArray.length === 0) {
        return NextResponse.json({ players: [] });
    }

    const friendsIdString = friendsArray
        .slice(0, 100)
        .map((f: Friend) => f.steamid)
        .join(",");

    const userProfileUrl = `${CONFIG.BASE_URL}ISteamUser/GetPlayerSummaries/v0002/?key=${CONFIG.API_KEY}&steamids=${friendsIdString}`;
    const profileRes = await fetch(userProfileUrl, { cache: 'no-store' });
    const profileData = await profileRes.json();
    return NextResponse.json(profileData.response.players);

} catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json({ err: 'Failed to fetch data' }, { status: 500 });
}

}
    
