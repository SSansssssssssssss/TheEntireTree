addLayer("ach", {
    name: "achievements", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ACH", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		//points: new Decimal(0),
    }},
    color: "#fcc603",
    //requires: new Decimal(10), // Can be a function that takes requirement increases into account
    //resource: "prestige points", // Name of prestige currency
    //baseResource: "points", // Name of resource prestige is based on
    //baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    //exponent: 0.5, // Prestige currency exponent
    //gainMult() { // Calculate the multiplier for main currency from bonuses
    //    mult = new Decimal(1)
    //    return mult
    //},
    //gainExp() { // Calculate the exponent on main currency from bonuses
    //    return new Decimal(1)
    //},
	tooltip: "",
    row: "side", // Row the layer is in on the tree (0 is the first row)
	achievements: {
		11: {
			name: "already prestiged",
			tooltip: "reset for a prestige point",
			image: "resources/ach1.png",
			done() {return player.p.points.gte(1)}
		},
		12: {
			name: "grade up",
			tooltip: "buy an upgrade",
			image: "resources/ach2.png",
			done() {return player.p.upgrades.length >= 1}
		},
		13: {
			name: "maxed out",
			tooltip: "max out point boost 1",
			image: "resources/ach3.png",
			done() {return getBuyableAmount("p", 11).gte(20)}
		},
		14: {
			name: "both of them too",
			tooltip: "max out point boost 1 & 2",
			image: "resources/ach4.png",
			done() {return getBuyableAmount("p", 11).gte(20) && getBuyableAmount("p", 12).gte(20)}
		},
		15: {
			name: "quartermillion",
			tooltip: "have 250,000 points",
			image: "resources/ach5.png",
			done() {return player.points.gte(250000)}
		},
		16: {
			name: "ascending to the skies",
			tooltip: "ascend",
			image: "resources/ach6.png",
			done() {return player.a.points.gte(1)}
		},
		21: {
			name: "prestiged quartermillion",
			tooltip: "have 250,000 prestige points",
			image: "resources/ach7.png",
			done() {return player.p.points.gte(250000)}
		},
		22: {
			name: "11ception",
			tooltip: "have 1.11e11 points",
			image: "resources/ach8.png",
			done() {return player.points.gte("1.11e11")}
		},
		23: {
			name: "slightly different",
			tooltip: "get a booster",
			image: "resources/ach9.png",
			done() {return player.b.points.gte("1")}
		},
		24: {
			name: "the good",
			tooltip: "have more than 77,777 ascended points",
			image: "resources/ach10.png",
			done() {return player.a.points.gte("77777")}
		},
		25: {
			name: "both of them too2",
			tooltip: "max out point boost 1 & 2 again",
			image: "resources/ach11.png",
			done() {return getBuyableAmount("p", 11).gte(100) && getBuyableAmount("p", 12).gte(100)}
		},
		26: {
			name: "boost-stuck",
			tooltip: "have 5 boosters",
			image: "resources/ach12.png",
			done() {return player.b.points.gte(5)}
		},
		31: {
			name: "12ception",
			tooltip: "have more than 1.212e12 prestige points",
			image: "resources/ach13.png",
			done() {return player.p.points.gte("1.212e12")}
		},
		32: {
			name: "undeascended",
			tooltip: "have more than 100,000,000 ascended points",
			image: "resources/ach14.png",
			done() {return player.p.points.gte("1e8")}
		},
		33: {
			name: "there's no deboosting",
			tooltip: "have 10 deboosters",
			image: "resources/ach15.png",
			done() {return player.d.points.gte("10")}
		},
		34: {
			name: "the desert of points",
			tooltip: "beat point desert 3 times",
			image: "resources/ach16.png",
			done() {return challengeCompletions("d",11)>=3}
		},
		35: {
			name: "escaped the boostrix",
			tooltip: "have 6 boosters",
			image: "resources/ach17.png",
			done() {return player.b.points.gte(6)}
		},
		36: {
			name: "when's the deboost",
			tooltip: "have 100,000 deboosters",
			image: "resources/ach18.png",
			done() {return player.d.points.gte(100000)}
		},
		41: {
			name: "pa-rupt",
			tooltip: "beat pa-crash 3 times",
			image: "resources/ach19.png",
			done() {return challengeCompletions("d",12)>=3}
		},
		42: {
			name: "180 degrees",
			tooltip: "have 9 boosts",
			image: "resources/ach20.png",
			done() {return player.b.points.gte(9)}
		},
		43: {
			name: "really essential",
			tooltip: "reset for essence",
			image: "resources/ach21.png",
			done() {return player.e.points.gte(1)}
		},
		44: {
			name: "unpossibility",
			tooltip: "have 11 boosts",
			image: "resources/ach22.png",
			done() {return player.b.points.gte(11)}
		},
		45: {
			name: "s-en-shal",
			tooltip: "max ascessential and pressential",
			image: "resources/ach23.png",
			done() {return getBuyableAmount("e",11).gte(10) && getBuyableAmount("e",12).gte(10)}
		},
		46: {
			name: "double maxed out",
			tooltip: "max Prestiged Essence and Ascended Essence",
			image: "resources/ach24.png",
			done() {return getBuyableAmount("p",13).gte(20) && getBuyableAmount("a",11).gte(20)}
		},
		51: {
			name: "unnerfed",
			tooltip: "have 5,000,000 deboosters",
			image: "resources/ach25.png",
			done() {return player.d.points.gte("5e6")}
		},
		52: {
			name: "boosterman",
			tooltip: "have 15 boosters",
			image: "resources/ach26.png",
			done() {return player.b.points.gte(15)}
		},
		53: {
			name: "have you felt pain yet?",
			tooltip: "beat pain 3 times",
			image: "resources/ach27.png",
			done() {return challengeCompletions("d",21)>=3}
		},
		54: {
			name: "proud sanic",
			tooltip: "beat un-slow",
			image: "resources/ach28.png",
			done() {return challengeCompletions("d",22)>=1}
		},
		55: {
			name: "deception",
			tooltip: "have 1.11e11 deboosters",
			image: "resources/ach29.png",
			done() {return player.d.points.gte(1e11)}
		},
		56: {
			name: "wise man",
			tooltip: "have 500,000 essence",
			image: "resources/ach30.png",
			done() {return player.e.points.gte(500000)}
		},
	},
    layerShown(){return true}
})