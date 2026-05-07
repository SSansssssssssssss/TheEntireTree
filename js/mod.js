let modInfo = {
	name: "The Entiretree",
	author: "bry / treeenjoyer",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js", "ach.js", "ascend.js", "booster.js", "debooster.js", "essence.js", "extra-x.js", "artxe-x.js"],

	discordName: "EXC Discord",
	discordLink: "discord.gg/9ZjwG5PGTU",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Not The Entirety",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0 - Not The Entirety</h3><br>
		- Added prestige points <br>
		- Added ascended points <br>
		- Added boosters <br>
		- Added deboosters <br>
		- Added essence <br>
		- Added extra <br>
		- Added artxe <br>
		- Added 30 main achievements <br>
		- Added 8 extra achievements <br>
		- Endgame is 1,000,000 Essence
`

let winText = `You have beaten... the entirety of Entiretree.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain=gain.times(buyableEffect("p",11))
	gain=gain.times(buyableEffect("p",12))
	if(hasUpgrade("p",11)) player.a.upg1=="Triplety" ? gain=gain.times(new Decimal(3).pow(1.3)) : gain=gain.times(3)
	if(hasUpgrade("p",12)) gain=gain.times(upgradeEffect("p",12))
	if(hasUpgrade("p",14)) gain=gain.times(upgradeEffect("p",14))
	if(hasUpgrade("p",15)) gain=gain.times(upgradeEffect("p",15))
	if(hasUpgrade("a",13)) player.a.upg2=="High Up" ? gain=gain.times(new Decimal(3).pow(1.3)) : gain=gain.times(3)
	if(player.b.points.gte(1)) gain=gain.times(tmp.b.effect)
	if(hasUpgrade("d",11)){
		let eff = new Decimal(3)
		if(inLayerChallenge("d")) eff=eff.times(10)
		gain=gain.times(eff)
	}
	if(hasUpgrade("d",13)) gain=gain.times(upgradeEffect("d",13))
	if(hasUpgrade("d",22)) gain=gain.times(3)
	if(hasUpgrade("p",21)) gain=gain.times(upgradeEffect("p",21))
	if(hasUpgrade("p",22)) gain=gain.times(upgradeEffect("p",22))
	if(hasUpgrade("e",11)) gain=gain.times(100)
	if(hasUpgrade("e",16)) gain=gain.times(3)
	if(hasUpgrade("p",23)) player.a.upg1=="Decuplety" ? gain=gain.times(new Decimal(10).pow(1.3)) : gain=gain.times(10)
	// debuffs
	if(inChallenge("d",11)) gain=gain.pow(0.5)
	if(inChallenge("d",21)) gain=gain.pow(0.1)
	if(inChallenge("d",22)) gain=gain.pow(player.d.unslowexp)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function() {
		if(!tmp.a.layerShown) return "Next Unlock: 250,000 points ("+format(player.points.plus(1).log(250000).times(100))+"%)"
		if(!tmp.b.layerShown) return "Next Unlock: 3,000 ascended points ("+format(player.a.points.plus(1).log(3000).times(100))+"%)"
		if(!tmp.d.layerShown) return "Next Unlock: 100,000,000 ascended points ("+format(player.a.points.plus(1).log(100000000).times(100))+"%)"
		if(!tmp.e.layerShown) return "Next Unlock: 10 boosters ("+format(Decimal.max(0,player.b.points.log(10).times(100)))+"%)"
		return "Endgame: 1,000,000 Essence ("+format(Decimal.max(0,player.e.points.log("1e6").times(100)))+"%)"
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.e.points.gte(new Decimal("1e6"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}