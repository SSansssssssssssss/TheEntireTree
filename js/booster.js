addLayer("b", {
    name: "boosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#5750d9",
    requires() {
		if(hasMilestone("b",6)) return new Decimal(1).div(1e9)
		if(hasMilestone("b",3)) return 0.5
		return 3000
	}, // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "ascended points", // Name of resource prestige is based on
    baseAmount() {return player.a.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
	base() {
		if(hasMilestone("b",6)) return 1000
		if(hasMilestone("b",3)) return 100
		return 5
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	effect() {return new Decimal(3).pow(player.b.points)},
	effectDescription() {return "multiplying points by "+format(this.effect())+"x [3^x]"},
    row: 1, // Row the layer is in on the tree (0 is the first row)
	milestones: {
		0: {
			requirementDescription: "2 Boosters",
			effectDescription: "Auto-buy Point Boost I and Point Boost II",
			done() {return player.b.points.gte(2)},
		},
		1: {
			requirementDescription: "3 Boosters",
			effectDescription: "Generate 10% of prestige points gain on reset",
			done() {return player.b.points.gte(3)},
			unlocked() {return hasMilestone("b",0)},
		},
		2: {
			requirementDescription: "4 Boosters",
			effectDescription: "Auto-buy the first 5 prestige point upgrades",
			done() {return player.b.points.gte(4)},
			unlocked() {return hasMilestone("b",1)},
		},
		3: {
			requirementDescription: "5 Boosters",
			effectDescription: "Generate 25% of prestige points on reset, booster price scales faster (100^x)/2, new ascended points upgrades",
			done() {return player.b.points.gte(5)},
			unlocked() {return hasMilestone("b",2)},
		},
		4: {
			requirementDescription: "6 Boosters",
			effectDescription: "Generate 10% of ascended points gain on reset, unlock more debooster challenges",
			done() {return player.b.points.gte(6)},
			unlocked() {return hasMilestone("b",3)},
		},
		5: {
			requirementDescription: "7 Boosters",
			effectDescription: "Generate 25% of ascended points gain on reset, more debooster upgrades",
			done() {return player.b.points.gte(7)},
			unlocked() {return hasMilestone("b",4)},
		},
		6: {
			requirementDescription: "9 Boosters",
			effectDescription: "Unlock more prestige point upgrades, booster price scales faster (1000^x)/1e9",
			done() {return player.b.points.gte(9)},
			unlocked() {return hasMilestone("b",5)},
		},
		7: {
			requirementDescription: "11 Boosters",
			effectDescription: "Unlock more prestige point, ascended point, and debooster buyables",
			done() {return player.b.points.gte(11)},
			unlocked() {return hasMilestone("b",6) && hasUpgrade("e",16)},
		},
	},
	onPrestige(gain){
		player.d.points = new Decimal(0)
	},
	resetsNothing(){
		if(hasUpgrade("e",21)) return true
		return false
	},
	branches: ["d", "e"],
	checkunlock() { if(player.a.points.gte(3000)) player.b.unlocked = true },
    layerShown(){return player.b.unlocked}
})