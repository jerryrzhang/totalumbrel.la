---
title: "A Steam achievement viewer web-app"
date: "2025-05-16"
tags: ["project"]
---

<figure class="full-image">
  <Image src="images/achievement/achievement.png" alt="Alt text"/>
  <figcaption>my top played games 😅</figcaption>
</figure>

<span class="first">I</span>'ve yet to figure out a name for this one, so for now it will simply be an unnamed steam achievement viewer 👾. This web-app takes your (or anyone elses) steam user id, and loads a list of all your games, with their playtime and achievement percentages for your **viewing pleasure**. Try it out for yourself [here!](https://jerryrzhang.github.io/Achievement/)

## Background
Technically, this project was started **almost exactly a year** before the article was written, in *early-mid 2024*. It's conception came from a lazy day sitting around doing nothing, and trying to decide which steam game I should full complete next. 

That was retrospectivley a terrible time... I had no idea what I was doing 👨‍💻. Perhaps evident by the fact that I had my steam api key floating around hardcoded client side in a public repo which I have since redacted using [bfg](https://rtyley.github.io/bfg-repo-cleaner/).. 💀

I then spent the next few hours attempting to *salvage* my sub par code by redirecting all client steam api calls towards a backend, which just adds the key to the requested url. 

>successfully amended the code and will continue to make some minor improvements as of 2025-05-17 😀

## Main Logic

Since this project is a *retroactive* revival of one done ages ago, the codebase is extremely messy. It's filled with terrible coding practices from a year ago mixed with (hopefully) better ones from now. If you want to take a look for yourself, the github repo is [here](https://github.com/jerryrzhang/Achievement). Next time I do something like this, I think I'll use Svelte.

### Api

The api for this project is shockingly simple, just taking in a request and sending it the [steam api](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetGlobalAchievementPercentagesForApp_.28v0001.29). All the parsing was originally done client side, so I kept it that way.

See the below code, which requests for the achievements in a game. 👇

```js
app.get('/api/achievements', async (req, res)=>{
    const gameId = req.query.gameId;
    const userId = req.query.userId;
    const response = await fetch("https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid="+gameId+"&key="+key+"&steamid="+userId);
    const data = await response.json();
    res.json(data);
})
```

At this endpoint, for the game [Terraria](https://store.steampowered.com/app/105600/Terraria/) we would recieve a json response in this format,

```json
{
    "playerstats":
    {
        "steamID": "76561198296334011",
        "gameName": "Terraria",
        "achievements":
        [
            {
                "name": "TIMBER",
                "achieved": 1
            },
            {
                "name": "NO_HOBO",
                "achieved": 1
            },
            {
                "name": "OBTAIN_HAMMER",
                "achieved": 1
            },
            ... so on so forth
        ]
    }
}
```

Which is then received by the client and *messily* parsed over, turning it into an array of game objects, which each have as much information as needed, and can be simply thrown into a template literal to append onto the main box.

```js
    game.innerHTML = `
    <div class="gameWin">
        <div class="left">
            <img class="imgWin" src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${gamesList[i].appid}/${gamesList[i].img_icon_url}.jpg" alt="">
            <div class ="name">
                ${gamesList[i].name}
            </div>
        </div>
        <div class="middle">
        </div>
        <div class="right">
            <div class="achieveWin">
                <div class="achieveFraction">
                ${achieveNumber}/${totalAchieve}
                </div>
                <div class="achievePercentage">
                    ${achievePercentage}%
                </div>
            </div>
            <div class="hours">
                ${time}h
            </div>
        </div>
    </div>
`
```

>All the api calls were moved to the server side, even those which don't use the key, since the steam api has some issues with CORS.

### Caching

Since this web-app is based entirely on api calls, almost all of its function is done asynchronously ⏳. This means that to fetch user and game details from Steam takes time, especially if the user has a very big library. Loading all these games every single time the page is opened becomes quite cumbersome, quite quickly. 😔

A simple solution to this is browser caching, where runtime data is stored in the client to be retrieved when the web app is next opened, and volatile data is lost. I think... there is a "*proper way*" to do this, but for this simple program I opted to store data in localstorage. 


>see below code where the parsed list of games is retrieved from local storage, and created if it does not exist.
```js
    let gamesList = localStorage.getItem("games")

    if (gamesList === null) {   
        gamesList = await getGames()
        localStorage.setItem("games", JSON.stringify(gamesList))
    } else {
        gamesList = JSON.parse(gamesList);
        games = gamesList;
    }
```

This way, the parsed list of games can be pulled client side on subsequent loads, as well as other data like filter settings and UID.

### Sorting

<figure class="small-right-image">
  <Image src="images/achievement/filter.png" alt="Alt text"/>
  <figcaption>graphic design is my passion :^)</figcaption>
</figure>

Obviously I needed some way to filter the list of games, for some semblance of usefulness,

For this, I decided to give the user the ability to sort by:
- play time 
- achievement percentage
- number of achievements
- first letter

All of which can be sorted descending or ascending. 

The code for this is extermely rudimentary, using [js' built in sorting function.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
```js
if (sortingDirectionGlobal == "dsc") {
    switch (sortingMethod) {
        case "0":
            gamesList.sort((a, b) => b.time - a.time)
            break;
        case "1":
            gamesList.sort((a, b) => b.achievePercentage - a.achievePercentage)
            break;
        case "2":
            gamesList.sort((a, b) => b.achieveNumber - a.achieveNumber)
            break;
    }
}
```
Descending sort code for example. 
>This sort function is stable, which means entries of identical key value will have order preserved from their last state. 

That's about all for this one, fairly simple proof of concept project. ✌️