addLayer("e-x", {
    name: "extra", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#3d7512",
    resource: "extra", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(!hasUpgrade("e-x",11))mult=new Decimal(0)
		if(hasUpgrade("e-x",12))mult=mult.times(5)
		if(hasUpgrade("e-x",13))mult=mult.times(2)
		if(getBuyableAmount("e-x",11).gte(1))mult=mult.times(buyableEffect("e-x",11))
		if(hasUpgrade("e-x",14))mult=mult.times(676767)
		if(hasUpgrade("e-x",15))mult=mult.times(500)
		if(hasUpgrade("e-x",21))mult=mult.times(3)
		if(getBuyableAmount("e-x",12).gte(1))mult=mult.times(buyableEffect("e-x",12))
		if(hasUpgrade("e-x",25))mult=mult.times(6767)
		if(hasUpgrade("a-x",11))mult=mult.times(100)
		if(hasUpgrade("a-x",12))mult=mult.times(10)
		if(hasUpgrade("a-x",15))mult=mult.times(1000)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
	infoboxes: {
		guide: {
			title: "Extra",
			body() { return `
				<h3>This content is optional and does not affect the main progression!</h3> Welcome to the extra layer!
				This layer is just here to waste your time, or if you're trying to get every achievement. Anyways, don't
				expect this layer to be balanced at all... so yeah have fun i guess.
			`}
		}
	},
	upgrades:{
		11:{
			title: "xtra idk",
			description: "start gen i mean gaining i mean",
			cost: new Decimal(0)
		},
		12:{
			title: "extra extra",
			description(){
				if(hasUpgrade("e-x",12)) return "jk x5 extra noob"
				return "you gain x1e100 more extra"
			},
			cost: new Decimal(30)
		},
		13:{
			title: "cool upgrade",
			description: "unlock a cool buyable but also your extra is cooler and get double gain",
			cost: new Decimal(200)
		},
		14:{
			title: "what",
			description: "the power of what gives you x676767 extra",
			cost: new Decimal(1e13)
		},
		15:{
			title: "LOL LOL ROFL",
			description: "i take all of ur cool buyable but i give u x500 ok",
			cost: new Decimal("5e45"),
			onPurchase(){
				setBuyableAmount("e-x",11,new Decimal(0))
			}
		},
		21:{
			title: "epic upgrade",
			description: "unlock a epic buyable but also your extra is epicer and get triple gain",
			cost: new Decimal("2e57"),
		},
		22:{
			title: "help me aaaa",
			description: "up cool buyable limit to /670",
			cost: new Decimal("1e62"),
		},
		23:{
			title: "epic to epic buyable",
			description: "quadruple = epic buyable limit",
			cost: new Decimal("1e205"),
		},
		24:{
			title: "what now",
			description: "idk",
			cost: new Decimal("3e580"),
		},
		25:{
			title: "ok i know",
			description: "unlock artxE FOREVER!!! also x6767 ur extra",
			cost: new Decimal("3e580"),
			unlocked(){return hasUpgrade("e-x",24)},
			onPurchase(){
				player["a-x"].unlocked = true
			}
		},
	},
	buyables:{
		11: {
			title() {return "cool buyable ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "quintuple ur extra\ncost: "+format(this.cost())+" extra\nnow: "+format(this.effect())+"x" },
			cost(x) { return Decimal.pow(7,x) },
			effect(x) { return Decimal.pow(5,x) },
			buy() {
				while (player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit())) {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					addBuyables(this.layer, this.id, 1)
				}
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 67
				if(hasUpgrade("e-x",22))x=670
				return x
			},
			tooltip: "7^x... or is it?",
			unlocked(){return hasUpgrade("e-x",13)}
		},
		12: {
			title() {return "epic buyable ["+getBuyableAmount(this.layer, this.id)+"/"+this.purchaseLimit()+"]"},
			display() { return "quadruple ur extra\ncost: "+format(this.cost())+" extra\nnow: "+format(this.effect())+"x" },
			cost(x) { return Decimal.pow(5,x).times("2e57") },
			effect(x) { return Decimal.pow(4,x) },
			buy() {
				while (player[this.layer].points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit())) {
					player[this.layer].points = player[this.layer].points.sub(this.cost())
					addBuyables(this.layer, this.id, 1)
				}
			},
			canAfford() { return player[this.layer].points.gte(this.cost()) },
			purchaseLimit(){
				let x = 42
				if(hasUpgrade("e-x",23))x=x*4
				return x
			},
			tooltip: "5^x... organism?",
			unlocked(){return hasUpgrade("e-x",21)}
		},
	},
	achievements:{
		11:{
			name: "extra(s)",
			tooltip: "have 1 extra",
			image: "resources/xach1.png",
			done(){return player["e-x"].points.gte(1)},
		},
		12:{
			name: "such a sigma",
			tooltip: "buy cool buyable 15 times",
			image: "resources/xach2.png",
			done(){return getBuyableAmount("e-x",11).gte(15)}
		},
		13:{
			name: "HAHA 67 REFERENCE",
			tooltip: "buy cool buyable 67 times",
			image: "resources/xach3.png",
			done(){return getBuyableAmount("e-x",11).gte(67)}
		},
		14:{
			name: "2Googgles",
			tooltip: "1e200 extra",
			image: "resources/xach4.png",
			done(){return player["e-x"].points.gte("1e200")}
		},
		15:{
			name: "meaning of Tree",
			tooltip: "max out epic buyable... 42*4",
			image: "resources/xach5.png",
			done(){return getBuyableAmount("e-x",12).gte(168)}
		},
		16:{
			name: "the art of artxe",
			tooltip: "reset for artxe",
			image: "resources/xach6.png",
			done(){return player["a-x"].points.gte(1)}
		},
		21:{
			name: "lazy person",
			tooltip: "get qoe and qoe",
			image: "resources/xach7.png",
			done(){return hasUpgrade("a-x",13) && hasUpgrade("a-x",14)}
		},
		22:{
			name: "FIVE FIVE!",
			tooltip: "have +5 artxe on reset",
			image: "resources/xach8.png",
			done(){return getResetGain("a-x").gte(5)}
		},
	},
	update(diff){
		if(hasUpgrade("e-x",11)) player["e-x"].points = player["e-x"].points.plus(tmp["e-x"].gainMult.times(diff))
	},
	automate() {
		if(hasUpgrade("a-x",13)){ 
			autobuyBuyables("e-x",12);
			autobuyBuyables("e-x",11);
		}
		if(hasUpgrade("a-x",14)){ 
			buyUpg("e-x",11);
			buyUpg("e-x",12);
			buyUpg("e-x",13);
			buyUpg("e-x",14);
			buyUpg("e-x",15);
			buyUpg("e-x",21);
			buyUpg("e-x",22);
			buyUpg("e-x",23);
			buyUpg("e-x",24);
			buyUpg("e-x",25);
		}
		
	},
	componentStyles: {
		"buyable"() {return {"height": "100px"}}
	},
	doReset(resettingLayer){
		let keep = ["achievements"]
		if(resettingLayer=="a-x"){
			layerDataReset("e-x",keep)
		}
	},
	tabFormat: {
		"Extra": {
			content: [
				["infobox","guide"],
				"main-display",
				["display-text",function(){return "("+format(tmp["e-x"].gainMult)+"/sec)"}],
				"buyables",
				"upgrades"
			]
		},
		"Achievements": {
			content: ["achievements"]
		},
	},
    layerShown(){return true}
})