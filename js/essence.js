addLayer("e", {
    name: "essence", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#fc8403",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "essence", // Name of prestige currency
    baseResource: "boosters", // Name of resource prestige is based on
    baseAmount() {return player.b.points}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(getBuyableAmount("p",13).gte(1)) mult=mult.times(buyableEffect("p",13))
		if(getBuyableAmount("a",11).gte(1)) mult=mult.times(buyableEffect("a",11))
		if(getBuyableAmount("d",11).gte(1)) mult=mult.times(buyableEffect("d",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		return new Decimal(10).times(tmp.e.gainMult)
	},
	getNextAt(canMax=false) {
		return new Decimal(10)
	},
	canReset() {return player.b.points.gte(10)},
	prestigeButtonText() {
		return "Reset for <b>+"+formatWhole(tmp.e.getResetGain)+"</b> essence"
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
	infoboxes: {
		guide: {
			title: "Essence",
			body() { return `
				Nice job getting to this point. Anyways, this layer is basically just an upgrade tree. Base currency gain will always be
				10, and can only be increased with boosts. You need 10 boosters to reset for essence. Good luck!
			`}
		}
	},
	upgrades: {
		11:{
			title: "Pointessential",
			description: "x100 Points, generate 100% of prestige points ascended points gain on reset",
			cost: new Decimal(10),
			branches: [13],
		},
		12:{
			title: "Duoessential",
			description: "x10 prestige points and ascended points, generate 100% of prestige points ascended points gain on reset",
			cost: new Decimal(10),
			branches: [13],
		},
		13:{
			title: "PA-hsarC",
			description: "PA-Crash is nerfed to ^0.75",
			cost: new Decimal(10),
			unlocked(){return hasUpgrade("e",11) && hasUpgrade("e",12)},
			branches: [14],
		},
		14:{
			title: "Speed of Light",
			description: "Auto-buy first 5 ascended point upgrades, keep slot configurations.",
			cost: new Decimal(10),
			unlocked(){return hasUpgrade("e",13)},
		},
		15:{
			title: "Dessential",
			description: "Auto-buy first 8 debooster upgrades, x3 deboosters",
			cost: new Decimal(10),
			unlocked(){return getBuyableAmount("e",11).gte(1) && getBuyableAmount("e",12).gte(1)},
			branches: [16],
		},
		16:{
			title: "Undecuple",
			description: "Unlock a new booster milestone, x3 points, prestige points, ascended points",
			cost: new Decimal(10),
			unlocked(){return hasUpgrade("e",15)},
			branches: [17]
		},
		17:{
			title: "Essencetial",
			description: "Essence boosts prestige points and ascended points.",
			cost: new Decimal(100),
			effect() {
				let eff = Decimal.pow(player.e.points,0.1).times(player.e.points.plus(1).log10()).plus(1)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "(x^0.1)*log10(x)",
			unlocked(){return hasUpgrade("e",16)},
			branches: [18,19]
		},
		18:{
			title: "The Prestige Essence",
			description: "Unlock new prestige point upgrades",
			cost: new Decimal(1000),
			unlocked(){return hasUpgrade("e",17)},
			branches: [21],
		},
		19:{
			title: "The Ascension Essence",
			description: "Unlock new ascended point upgrades",
			cost: new Decimal(1000),
			unlocked(){return hasUpgrade("e",17)},
			branches: [21],
		},
		21:{
			title: "Greater Essence",
			description: "x10 prestige points, boosters reset nothing, more debooster upgrades",
			cost: new Decimal(25000),
			unlocked(){return hasUpgrade("e",18) && hasUpgrade("e",19)},
		},
	},
	buyables: {
		11: {
			title() {return "<span style='font-weight: 700; font-family: Lucida Console, Courier New, monospace; font-size:12px'>Ascessential ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]</span>"},
			display() { return "x1.3 ascended points compounding\nCost: "+format(this.cost())+" essence\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return new Decimal(2) },
			effect(x) { return Decimal.pow(1.3,x) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				addBuyables(this.layer, this.id, 1)
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 10
				return x
			},
			tooltip: "1.3^x",
			unlocked(){return hasUpgrade("e",14)},
		},
		12: {
			title() {return "<span style='font-weight: 700; font-family: Lucida Console, Courier New, monospace; font-size:12px'>Prestessential ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]</span>"},
			display() { return "x1.3 prestige points compounding\nCost: "+format(this.cost())+" essence\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return new Decimal(2) },
			effect(x) { return Decimal.pow(1.3,x) },
			buy() {
				player[this.layer].points = player[this.layer].points.sub(this.cost())
				addBuyables(this.layer, this.id, 1)
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 10
				return x
			},
			tooltip: "1.3^x",
			unlocked(){return hasUpgrade("e",14)},
		},
	},
	componentStyles: {
		"buyable"() {return {"height": "120px", "width": "120px"}}
	},
	nodeStyle() {return {"animation": "essenceanim 2s ease-in-out infinite alternate"}},
	style() {return {"animation": "essenceanim2 2s ease-in-out infinite alternate"}},
	checkunlock() { if(player.b.points.gte(10)) player.e.unlocked = true },
	tabFormat: [
		["infobox","guide"],
		"main-display",
		"resource-display",
		"prestige-button",
		"blank",
		["row",[ ["upgrade",11],"blank",["upgrade",12] ]],
		"blank",
		["upgrade",13],
		"blank",
		["upgrade",14],
		"blank",
		["row",[ ["buyable",11],"blank",["buyable",12] ]],
		["display-text","Have atleast 1 of both of these to go further"],
		"blank",
		["upgrade",15],
		"blank",
		["upgrade",16],
		"blank",
		["upgrade",17],
		"blank",
		["row",[ ["upgrade",18],"blank",["upgrade",19] ]],
		"blank",
		["upgrade",21]
	],
    layerShown(){return player.e.unlocked}
})