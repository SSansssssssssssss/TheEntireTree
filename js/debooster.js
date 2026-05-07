addLayer("d", {
    name: "deboosters", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		unslowexp: new Decimal(1),
    }},
    color: "#72d94a",
    resource: "deboosters", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasChallenge("d",11)) mult=mult.times(challengeEffect("d",11))
		if(hasChallenge("d",12)) mult=mult.times(challengeEffect("d",12))
		if(hasUpgrade("d",21)) mult=mult.times(10)
		if(hasUpgrade("e",15)) mult=mult.times(3)
		if(hasUpgrade("a",23)) mult=mult.times(upgradeEffect("a",23))
		if(hasUpgrade("d",24)) mult=mult.times(3)
		if(hasChallenge("d",21)) mult=mult.times(challengeEffect("d",21))
		if(hasChallenge("d",22)) mult=mult.times(challengeEffect("d",22))
		if(!hasChallenge("d",11)) mult = new Decimal(0)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	challenges: {
		11: {
			name(){return "Point Desert ["+challengeCompletions(this.layer,this.id)+"/3]"},
			challengeDescription: "Reset points & row 1, and ^0.5 points",
			goalDescription() {
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal(100000).times(Decimal.pow(2,x))
				return format(need)+" points"
			},
			rewardDescription: "Start gaining deboosters. Further completions grant x3 deboosters compounding.",
			completionLimit: 3,
			rewardDisplay() {return format(this.rewardEffect())+"x"},
			rewardEffect() {
				let x = challengeCompletions(this.layer,this.id)
				let eff = Decimal.pow(3,x-1)
				return Decimal.max(eff,1)
			},
			canComplete() { // 100000*(2^x)
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal(100000).times(Decimal.pow(2,x))
				return player.points.gte(need)
			},
			onEnter() {
				player.points = new Decimal(0)
				rowReset(0,"b")
			}
		},
		12: {
			name(){return "PA-Crash ["+challengeCompletions(this.layer,this.id)+"/3]"},
			challengeDescription: "Reset points & row 1, ^0.5 prestige points and ascended points",
			goalDescription() {
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal("1e16").times(Decimal.pow(2,x))
				return format(need)+" points"
			},
			rewardDescription: "x3 deboosters compounding (1 completion: unlock new debooster upgrades)",
			completionLimit: 3,
			rewardDisplay() {return format(this.rewardEffect())+"x"},
			rewardEffect() {
				let x = challengeCompletions(this.layer,this.id)
				let eff = Decimal.pow(3,x)
				return eff
			},
			canComplete() { // 100000*(2^x)
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal("1e16").times(Decimal.pow(2,x))
				return player.points.gte(need)
			},
			onEnter() {
				player.points = new Decimal(0)
				rowReset(0,"b")
			},
			unlocked(){return hasMilestone("b",4)},
		},
		21: {
			name(){return "PAin ["+challengeCompletions(this.layer,this.id)+"/3]"},
			challengeDescription: "Reset points & row 1, ^0.1 points, prestige points, and ascended points",
			goalDescription() {
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal("1000").times(Decimal.pow(2,x))
				return format(need)+" points"
			},
			rewardDescription: "x10 deboosters compounding",
			completionLimit: 3,
			rewardDisplay() {return format(this.rewardEffect())+"x"},
			rewardEffect() {
				let x = challengeCompletions(this.layer,this.id)
				let eff = Decimal.pow(10,x)
				return eff
			},
			canComplete() {
				let x = challengeCompletions(this.layer,this.id)
				let need = new Decimal("1000").times(Decimal.pow(2,x))
				return player.points.gte(need)
			},
			onEnter() {
				player.points = new Decimal(0)
				rowReset(0,"b")
			},
			unlocked(){return hasUpgrade("d",24)},
		},
		22: {
			name(){return "Un-Slow ["+challengeCompletions(this.layer,this.id)+"/1]"},
			challengeDescription(){return"Reset points, row 1, boosters, and booster milestones. The exponent on points, prestige points, and ascended points will slowly decrease over time. Be fast!<br>Current Nerf: ^"+format(player.d.unslowexp)},
			goalDescription() {
				return "10 boosters"
			},
			rewardDescription: "x1000 deboosters",
			completionLimit: 1,
			rewardDisplay() {return format(this.rewardEffect())+"x"},
			rewardEffect() {
				let x = challengeCompletions(this.layer,this.id)
				let eff = Decimal.pow(1000,x)
				return eff
			},
			canComplete() {
				return player.b.points.gte(10)
			},
			onEnter() {
				player.d.unslowexp = new Decimal(1)
				player.points = new Decimal(0)
				rowReset(0,"b")
				player.b.points = new Decimal(0)
				player.b.milestones = []
			},
			onExit() {
				player.d.unslowexp = new Decimal(1)
			},
			unlocked(){return hasUpgrade("d",24)},
		},
	},
	upgrades: {
		11:{
			title: "DeDePoints",
			description: "x3 points, x30 if in a debooster challenge",
			cost: new Decimal(15),
		},
		12:{
			title: "DeDePrestige",
			description: "x3 prestige points, x9 if in a debooster challenge",
			cost: new Decimal(150),
		},
		13:{
			title: "Point Booster",
			description: "Deboosters boost points",
			cost: new Decimal(500),
			effect() {
				return player.d.points.plus(1).log10().plus(1)
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log10(x)",
		},
		14:{
			title: "Rising Deboosters",
			description: "Deboosters boost ascended points",
			cost: new Decimal(1000),
			effect() {
				return player.d.points.plus(1).log(20).plus(1)
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "log20(x)",
		},
		15:{
			title: "DeDeAscension",
			description: "x3 ascended points, x9 if in a debooster challenge",
			cost: new Decimal(2000),
			unlocked(){return challengeCompletions("d",12)>=1},
		},
		21:{
			title: "Dedeboosting",
			description: "x10 deboosters, but your deboosters reset upon purchasing this upgrade",
			cost: new Decimal(3000),
			unlocked(){return challengeCompletions("d",12)>=1},
			onPurchase() {player.d.points = new Decimal(0)},
		},
		22:{
			title: "We have Points",
			description: "x3 points, prestige points, ascended points",
			cost: new Decimal(10000),
			unlocked(){return hasMilestone("b",5)},
		},
		23:{
			title: "DeMaximum DePrestige",
			description: "Deboosters boost prestige points",
			cost: new Decimal(100000),
			effect() {
				return player.d.points.plus(9999).pow(0.5).pow(0.5).pow(0.5)
			},
			effectDisplay() {return format(this.effect())+"x" },
			tooltip: "(x+9999)^0.5^0.5<br>^0.5",
			unlocked(){return hasMilestone("b",5)},
		},
		24:{
			title: "Deboosters are back!",
			description: "Unlock more debooster challenges. x3 deboosters.",
			cost: new Decimal(5e6),
			unlocked(){return hasUpgrade("e",21)},
		},
		25:{
			title: "Salvation",
			description: "x10 ascended points",
			cost: new Decimal(1e11),
			unlocked(){return hasUpgrade("e",21)},
		},
	},
	buyables: {
		11: {
			title() {return "De-UnEssence ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "x1.2 essence compounding\nCost: "+format(this.cost())+" deboosters\nCurrently: "+format(this.effect())+"x" },
			cost(x) { return Decimal.pow(2,x).times(100000) },
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
			tooltip: "2^x * 100,000",
			unlocked() {return hasMilestone("b",7)},
		},
	},
	update(diff){
		if(hasChallenge("d",11)){
			let gain = tmp.d.gainMult
			player.d.points = player.d.points.plus(gain.times(diff))
		}
		if(inChallenge("d",22)) player.d.unslowexp = player.d.unslowexp.sub(diff/50)
		player.d.unslowexp = Decimal.max(0.01,player.d.unslowexp)
	},
	automate() {
		if(hasUpgrade("e",15)){ 
			buyUpg("d",11);
			buyUpg("d",12);
			buyUpg("d",13);
			buyUpg("d",14);
			buyUpg("d",15);
			buyUpg("d",21);
			buyUpg("d",22);
			buyUpg("d",23);
		}
	},
	componentStyles: {
		"buyable"() {return {"height": "100px"}}
	},
	branches: ["e"],
	checkunlock() { if(player.a.points.gte("1e8")) player.d.unlocked = true },
	tabFormat:[
		"main-display",
		["display-text",function() {return "You are gaining "+format(tmp.d.gainMult)+" deboosters per second"}],
		["display-text","Boosters reset Deboosters!"],
		"buyables",
		"upgrades",
		"challenges",
	],
    layerShown(){return player.d.unlocked}
})