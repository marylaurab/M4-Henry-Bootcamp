const { Router } = require("express");
const { Ability } = require("../db");
const Character = require("../db/models/Character");
const router = Router();

router.post("/", async (req, res) => {
  const { name, description, mana_cost } = req.body;
  try {
    const newAbility = await Ability.create({
      name,
      description,
      mana_cost,
    });
    res.status(201).json(newAbility);
  } catch (error) {
    res.status(404).send("Falta enviar datos obligatorios");
  }
});
router.put("/setCharacter", async (req, res) => {
  const { idAbility, codeCharacter } = req.body;
  const foundAbility = await Ability.findByPk(idAbility);
 // console.log('ABILITY BEFORE:',foundAbility)
  await foundAbility.setCharacter(codeCharacter);
  //console.log('ABILITY AFTER:', foundAbility)
  res.json(foundAbility);
});

module.exports = router;
