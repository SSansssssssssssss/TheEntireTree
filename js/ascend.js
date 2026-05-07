addLayer("a", {
    name: "ascend", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		upg1: 0,
		upg2: 0,
		slowautoreset: 0,
    }},
    color: "#fffc96",
    requires: new Decimal(250000), // Can be a function that takes requirement increases into account
    resource: "ascended points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("a",14)) player.a.upg2=="Up There" ? mult=mult.times(new Decimal(3).pow(1.3)) : mult=mult.times(3)
		if(hasUpgrade("d",14)) mult=mult.times(upgradeEffect("d",14))
		if(hasUpgrade("d",15)){
			let eff = new Decimal(3)
			if(inLayerChallenge("d")) eff=eff.times(3)
			mult=mult.times(eff)
		}
		if(hasUpgrade("d",22)) mult=mult.times(3)
		if(hasUpgrade("e",12)) mult=mult.times(10)
		if(getBuyableAmount("e",11).gte(1)) mult=mult.times(buyableEffect("e",11))
		if(hasUpgrade("e",16)) mult=mult.times(3)
		if(hasUpgrade("e",17)) mult=mult.times(upgradeEffect("e",17))
		if(hasUpgrade("p",25)) player.a.upg2=="Morescend" ? mult=mult.times(new Decimal(5).pow(1.3)) : mult=mult.times(5)
		if(hasUpgrade("a",22)) mult=mult.times(upgradeEffect("a",22))
		if(hasUpgrade("d",25)) mult=mult.times(10)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
		// debuffs
		if(inChallenge("d",12)){
			if(hasUpgrade("e",13)){
				exp=new Decimal(0.75)
			}else{
				exp=new Decimal(0.5)
			}
		}
		if(inChallenge("d",21)) exp=new Decimal(0.1)
		if(inChallenge("d",22)) exp=player.d.unslowexp
		return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	infoboxes: {
		guide: {
			title: "Ascension",
			body() { return `
				Nice job getting to this point. Anyways, you can now use your ascended points to increase ascension slots.
				What do ascension slots do? You can choose an upgrade to 'ascend' and boost that upgrade's effect by ^1.3.
				Ascension slots limit how much upgrades you can ascend at once. Use it wisely! PS: Only certain upgrades
				can be ascended.
			`}
		}
	},
	clickables: {
		11: {
			display() {return "Hold to continuously reset"},
			style: {"width": "175px", "height": "50px", "min-height": "0px", "border-radius": "0%"},
			canClick() {return canReset("a")},
			onHold() { if(canReset("a"))doReset("a") },
		},
		12: {
			display() {return "Hold to continuously reset (slower)"},
			style: {"width": "175px", "height": "50px", "min-height": "0px", "border-radius": "0%"},
			canClick() {return canReset("a")},
			onHold() { 
				player.a.slowautoreset = player.a.slowautoreset + 1
				if(player.a.slowautoreset==5){
					player.a.slowautoreset = 0
					if(canReset("a"))doReset("a") 
				}
			},
		},
	},
	upgrades: {
		11: {
			title: "Slot 1",
			description: "Unlock the first ascension slot.",
			cost: new Decimal(1),
		},
		12: {
			title: "Sky High",
			description: "x5 prestige points, and unlock new prestige point upgrades",
			cost: new Decimal(2),
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		13: {
			title: "High Up",
			description: "x3 points & prestige points",
			cost: new Decimal(500),
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		14: {
			title: "Up There",
			description: "x3 ascended points",
			cost: new Decimal("2.5e6"),
			unlocked(){return hasMilestone("b",3)},
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		15: {
			title: "Slot 2",
			description: "Unlock the second ascension slot.",
			cost: new Decimal("1e7"),
			unlocked(){return hasMilestone("b",3)},
		},
		21: {
			title: "There be Prestige",
			description: "x10 prestige points",
			cost: new Decimal("1e28"),
			unlocked(){return hasUpgrade("e",18)},
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		22: {
			title: "Self-Ascension",
			description: "Ascended points boost itself",
			cost: new Decimal("1e29"),
			effect() {
				let eff = player.a.points.plus(1).log(100).plus(1)
				if(player.a.upg2 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log100(x)",
			unlocked(){return hasUpgrade("e",18)},
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		22: {
			title: "Self-Ascension",
			description: "Ascended points boost itself",
			cost: new Decimal("1e29"),
			effect() {
				let eff = player.a.points.plus(1).log(100).plus(1)
				if(player.a.upg2 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log100(x)",
			unlocked(){return hasUpgrade("e",18)},
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
		23: {
			title: "Reverse Deboost",
			description: "Ascended points boost deboosters",
			cost: new Decimal("1e31"),
			effect() {
				let eff = player.a.points.plus(1).log(1000).plus(1)
				if(player.a.upg2 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log1000(x)",
			unlocked(){return hasUpgrade("e",18)},
			style() {
				if(player.a.upg2 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
		},
	},
	buyables: {
		11: {
			title() {return "Ascended Essence ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "x1.2 essence compounding\nCost: "+format(this.cost())+" ascended points\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return Decimal.pow(2,x).times("1e22") },
			effect(x) { return Decimal.pow(1.2,x) },
			buy() {
				while (player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit())) {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					addBuyables(this.layer, this.id, 1)
				}
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 20
				return x
			},
			tooltip: "2^x * 1e22",
			unlocked() {return hasMilestone("b",7)},
		},
	},
	automate() {
		if(hasUpgrade("e",14)){ 
			buyUpg("a",11);
			buyUpg("a",12);
			buyUpg("a",13);
			buyUpg("a",14);
			buyUpg("a",15);
		}
	},
	passiveGeneration() {
		if(hasUpgrade("e",11) || hasUpgrade("e",12)) return new Decimal(1)
		if(hasMilestone("b",5)) return new Decimal(0.25)
		if(hasMilestone("b",4)) return new Decimal(0.1)
		return new Decimal(0)
	},
	componentStyles: {
		"buyable"() {return {"height": "100px"}}
	},
	doReset(resettingLayer){
		let keep = []
		if(hasUpgrade("e",14)){
			keep.push("upg1")
			keep.push("upg2")
		}
		if(tmp[resettingLayer].row>0) layerDataReset("a",keep)
	},
	tabFormat: [
		["infobox", "guide"],
		"main-display",
		["column",[
			"prestige-button",
			["clickable",11],
			["clickable",12],
		]],
		"resource-display",
		"buyables",
		"upgrades",
		["display-text",function(){return "Ascension"}],
		["drop-down", ["upg1",function() {
			let available = []
			if(hasUpgrade("p",11)) available.push("Triplety")
			if(hasUpgrade("p",12)) available.push("Dependencety")
			if(hasUpgrade("p",14)) available.push("Affinity")
			if(hasUpgrade("p",15)) available.push("Affectability")
			if(hasUpgrade("p",21)) available.push("Patiencety")
			if(hasUpgrade("p",22)) available.push("Codependencety")
			if(hasUpgrade("p",23)) available.push("Decuplety")
			if(hasUpgrade("p",24)) available.push("Morestige")
			if(hasUpgrade("p",25)) available.push("Morescend")
			if(!hasUpgrade("a",11)) available = []
			return available
		}
		],function(){if(!hasUpgrade("a",11))return {"display":"none"}}],
		["drop-down", ["upg2",function() {
			let available = []
			if(hasUpgrade("a",12)) available.push("Sky High")
			if(hasUpgrade("a",13)) available.push("High Up")
			if(hasUpgrade("a",14)) available.push("Up There")
			if(hasUpgrade("a",21)) available.push("There be Prestige")
			if(hasUpgrade("a",22)) available.push("Self-Ascension")
			if(hasUpgrade("a",23)) available.push("Reverse Deboost")
			if(!hasUpgrade("a",15)) available = []
			return available
		}
		],function(){if(!hasUpgrade("a",15))return {"display":"none"}}]
	],
	branches: ["b","d"],
    layerShown(){return hasAchievement("ach",15)}
})