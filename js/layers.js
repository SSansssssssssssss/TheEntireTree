addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		pb1auto: true,
		upg5auto: true,
		patiencety: 0,
		slowautoreset: 0,
    }},
    color: "#f25050",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("a", 12)) player.a.upg2=="Sky High" ? mult=mult.times(new Decimal(5).pow(1.3)) : mult=mult.times(5)
		if(hasUpgrade("a",13)) player.a.upg2=="High Up" ? mult=mult.times(new Decimal(3).pow(1.3)) : mult=mult.times(3)
		if(hasUpgrade("d",12)){
			let eff = new Decimal(3)
			if(inLayerChallenge("d")) eff=eff.times(3)
			mult=mult.times(eff)
		}
		if(hasUpgrade("d",22)) mult=mult.times(3)
		if(hasUpgrade("d",23)) mult=mult.times(upgradeEffect("d",23))
		if(hasUpgrade("e",12)) mult=mult.times(10)
		if(getBuyableAmount("e",12).gte(1)) mult=mult.times(buyableEffect("e",12))
		if(hasUpgrade("e",16)) mult=mult.times(3)
		if(hasUpgrade("e",17)) mult=mult.times(upgradeEffect("e",17))
		if(hasUpgrade("a",21)) player.a.upg2=="There be Prestige" ? mult=mult.times(new Decimal(10).pow(1.3)) : mult=mult.times(10)
		if(hasUpgrade("p",24)) player.a.upg1=="Morestige" ? mult=mult.times(new Decimal(5).pow(1.3)) : mult=mult.times(5)
		if(hasUpgrade("e",21)) mult=mult.times(10)
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
	buyables: {
		11: {
			title() {return "Point Boost I ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "+100% points per purchase\nCost: "+format(this.cost())+" prestige points\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return new Decimal(1).times(new Decimal(1).plus(x)).times(new Decimal(1.12).pow(x)).round() },
			effect(x) { return x.plus(1) },
			buy() {
				while (player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit())) {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					addBuyables(this.layer, this.id, 1)
				}
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 20
				if(hasUpgrade("p", 13)) x = 100
				return x
			},
			tooltip: "(1+x)*(1.12^x)"
		},
		12: {
			title() {return "Point Boost II ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "+100% points per purchase\nCost: "+format(this.cost())+" prestige points\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return new Decimal(10).times(new Decimal(1).plus(x)).times(new Decimal(1.12).pow(x)).round() },
			effect(x) { return x.plus(1) },
			buy() {
				while (player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit())) {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					addBuyables(this.layer, this.id, 1)
				}
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 20
				if(hasUpgrade("p", 13)) x = 100
				return x
			},
			tooltip: "10*(1+x)*(1.12^x)"
		},
		13: {
			title() {return "Prestiged Essence ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "x1.2 essence compounding\nCost: "+format(this.cost())+" prestige points\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return Decimal.pow(2,x).times("1e25") },
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
			tooltip: "2^x * 1e25",
			unlocked() {return hasMilestone("b",7)},
		},
	},
	clickables: {
		11: {
			display() {return "Hold to continuously reset"},
			style: {"width": "175px", "height": "50px", "min-height": "0px", "border-radius": "0%"},
			canClick() {return canReset("p")},
			onHold() { if(canReset("p"))doReset("p") },
		}, // to do: hold to continuously reset every 0.5s
		12: {
			display() {return "Hold to continuously reset (slower)"},
			style: {"width": "175px", "height": "50px", "min-height": "0px", "border-radius": "0%"},
			canClick() {return canReset("p")},
			onHold() { 
				player.p.slowautoreset = player.p.slowautoreset + 1
				if(player.p.slowautoreset==5){
					player.p.slowautoreset = 0
					if(canReset("p"))doReset("p") 
				}
			},
		},
	},
	upgrades: {
		11: {
			title: "Triplety",
			description: "Triple point gain",
			cost: new Decimal(50),
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			}
		},
		12: {
			title: "Dependencety",
			description: "Prestige points boost point gain",
			cost: new Decimal(250),
			effect() {
				let eff = player.p.points.pow(0.25).plus(1)
				if(player.a.upg1 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "x^0.25",
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			}
		},
		13: {
			title: "Capacity",
			description: "Increase cap of Point Boost I and Point Boost II by 80",
			cost: new Decimal(15000),
			unlocked() {return hasUpgrade("a",12)}
		},
		14: {
			title: "Affinity",
			description: "Ascended points boost point gain",
			cost: new Decimal(30000),
			effect() {
				let eff = player.a.points.pow(0.5).plus(1)
				if(player.a.upg1 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "x^0.5",
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked() {return hasUpgrade("a",12)}
		},
		15: {
			title: "Affectability",
			description: "Points boost point gain",
			cost: new Decimal(300000),
			effect() {
				let eff = player.points.plus(1).log10().plus(1)
				if(player.a.upg1 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log10(x+1)",
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked() {return hasUpgrade("a",12)}
		},
		21: {
			title: "Patiencety",
			description: "The longer you have this upgrade, more point boost",
			cost: new Decimal("1e18"),
			effect() {
				let eff = new Decimal(player.p.patiencety).plus(1).log10().plus(1)
				if(player.a.upg1 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log10(x)",
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			onPurchase() {player.p.patiencety = 0},
			unlocked(){return hasMilestone("b",6)},
		},
		22: {
			title: "Codependencety",
			description: "Boost points based on the effect of Dependencety",
			cost: new Decimal("5e18"),
			effect() {
				let eff = upgradeEffect("p",12).plus(1).log(2).plus(1)
				if(player.a.upg1 == this.title) eff = eff.pow(1.3)
				return eff
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log2(x)",
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked(){return hasMilestone("b",6)},
		},
		23: {
			title: "Decuplety",
			description: "x10 point gain",
			cost: new Decimal("1e31"),
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked(){return hasUpgrade("e",18)},
		},
		24: {
			title: "Morestige",
			description: "x5 prestige point gain",
			cost: new Decimal("1e32"),
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked(){return hasUpgrade("e",18)},
		},
		25: {
			title: "Morescend",
			description: "x5 ascended point gain",
			cost: new Decimal("1e33"),
			style() {
				if(player.a.upg1 == this.title && hasUpgrade(this.layer,this.id)) return {"background-color": "#fffc96", "animation": "ascendedglow 2s infinite"}
			},
			unlocked(){return hasUpgrade("e",18)},
		},
	},
	automate() {
		if(hasMilestone("b",2) && player.p.upg5auto){ 
			buyUpg("p",11);
			buyUpg("p",12);
			buyUpg("p",13);
			buyUpg("p",14);
			buyUpg("p",15);
		}
		if(hasMilestone("b",0) && player.p.pb1auto){ 
			autobuyBuyables("p",12);
			autobuyBuyables("p",11);
		}
	},
	update(diff){
		if(hasUpgrade("p",21)) player.p.patiencety = player.p.patiencety + diff
	},
	passiveGeneration() {
		if(hasUpgrade("e",11) || hasUpgrade("e",12)) return new Decimal(1)
		if(hasMilestone("b",3)) return new Decimal(0.25)
		if(hasMilestone("b",1)) return new Decimal(0.1)
		return new Decimal(0)
	},
	componentStyles: {
		"buyable"() {return {"height": "100px"}}
	},
	tabFormat: [
		"main-display",
		["column",[
			"prestige-button",
			["clickable",11],
			["clickable",12],
		]],
		"resource-display",
		"buyables",
		"upgrades",
		["row",[
			["column",[
				["display-text","Auto-buy Point Boost I-II",function(){if(!hasMilestone("b",0))return {"display":"none"}}],
				["toggle",["p","pb1auto"],function(){if(!hasMilestone("b",0))return {"display":"none"}}],
			]],
			"blank",
			["column",[
				["display-text","Auto-buy first 5 upgrades",function(){if(!hasMilestone("b",2))return {"display":"none"}}],
				["toggle",["p","upg5auto"],function(){if(!hasMilestone("b",2))return {"display":"none"}}],
			]],
		]],
	],
	branches: ["a", "b","d"],
    layerShown(){return true}
})
