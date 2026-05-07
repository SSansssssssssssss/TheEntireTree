addLayer("a-x", {
    name: "artxe", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#42f59e",
    requires: new Decimal("1e584"), // Can be a function that takes requirement increases into account
    resource: "artxe", // Name of prestige currency
    baseResource: "extra", // Name of resource prestige is based on
    baseAmount() {return player["e-x"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
	upgrades:{
		11:{
			title: "summore extras",
			description: "x100 extra be greatful",
			cost: new Decimal(1),
		},
		12:{
			title: "maximum extradrive",
			description: "uhhh x10 extra",
			cost: new Decimal(2),
		},
		13:{
			title: "quality of extra (QoE)",
			description: "auto buy cool buyable and epic buyable... simply because they are cool and epic of course",
			cost: new Decimal(3),
		},
		14:{
			title: "extra QoE",
			description: "auto buy first 10 extra upgrade cuz u lazy",
			cost: new Decimal(5),
		},
		15:{
			title: "qwertyuiop",
			description: "x1000 extra. also this is the endgame check here in further updates eee",
			cost: new Decimal(6),
		},
	},
    layerShown(){return player["a-x"].unlocked}
})