const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { code, name, age, race, hp, mana, date_added } = req.body;
  if (!code || !name || !hp || !mana)
    return res.status(404).send("Falta enviar datos obligatorios");
  try {
    const newCharacter = await Character.create({
      code,
      name,
      age,
      race,
      hp,
      mana,
      date_added,
    });
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, name, hp, age, mana, date_added } = req.query;
  let condition = {};
  let where = {};
  let attributes = [];
  if (race && !age) {
    where.race = race;
  }
  if (age) {
    where = { [Op.and]: [{ race: race }, { age: age }] };
    condition.where = where;
    //console.log('OBJ WHERE',where)
  }
  if (mana) {
    where.mana = mana;
  }
  if (date_added) {
    where.date_added = date_added;
  }
  if (name) attributes.push("name");
  if (hp) attributes.push("hp");
  //console.log('array de atributos:',attributes)
  if (attributes.length > 0) condition.attributes = attributes;
  //console.log('obj condicition:', condition)
  if (Object.keys(where).length > 0) condition.where = where;
  //console.log('KEYS DE CONDITION:', Object.keys(where))
  try {
    const characters = await Character.findAll(condition);
    res.json(characters);
  } catch (error) {
    res.status(404).json(error.message);
  }

  //No optimo:-------------------------------------------------
  // if (!race && !name && !hp) {
  //   try {
  //     const characters = await Character.findAll();
  //     res.json(characters);
  //   } catch (error) {
  //     res
  //       .status(404)
  //       .send(`El código ${code} no corresponde a un personaje existente`);
  //   }
  // } else if (race && !name && !hp) {
  //   try {
  //     const characters = await Character.findAll({
  //       where: {
  //         race,
  //       },
  //     });
  //     res.json(characters);
  //   } catch (error) {
  //     res
  //       .status(404)
  //       .send(`El código ${code} no corresponde a un personaje existente`);
  //   }
  // }else if (!race && name && hp) {
  //   try {
  //     const characters = await Character.findAll({
  //       attributes: ['name','hp']
  //     });
  //     res.json(characters);
  //   } catch (error) {
  //     res
  //       .status(404)
  //       .send(`El código ${code} no corresponde a un personaje existente`);
  //   }
  // }
  //--------------------------------------------------------------------------
  // let condition = {}; //POR QUE NO FUNCA?
  // if (race) condition.where = { race };

  // try {
  //   const characters = await findAll(condition);
  //   res.json(characters);
  // } catch (error) {
  //   res
  //     .status(404)
  //     .send(`El código ${code} no corresponde a un personaje existente`);
  // }
});
router.get("/young", async (req, res) => {
  try {
    const youngers = await Character.findAll({
      where: {
        age: {
          [Op.lt]: 25,
        },
      },
    });
    if (!youngers) return res.send("No se encontro ningun match");
    res.json(youngers);
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.get("/roles/:code", async (req, res) => {
  const { code } = req.params;
  const roles = await Character.findByPk(code, {
    include: Role
  });
  res.json(roles);
});
router.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const characters = await Character.findByPk(code);
    if (!characters) {
      return res
        .status(404)
        .send(`El código ${code} no corresponde a un personaje existente`);
    }
    res.json(characters);
  } catch (error) {
    res.status(404).send(error);
  }
});
router.put("/addAbilities", async (req, res) => {
  const { codeCharacter, abilities } = req.body;
  const foundCharacter = await Character.findByPk(codeCharacter);
  abilities.forEach(async (a) => {
    await foundCharacter.createAbility(a);
  });
  res.send("Abilities created and added");
});

router.put("/:attribute", async (req, res) => {
  const { attribute } = req.params;
  const { value } = req.query;
  // NO FUNCIONA, POR???
  //try {
  //   const toUpdate = await Character.findAll({
  //     where: {
  //       [attribute]: { [Op.eq]: null },
  //     },
  //   });
  //   console.log('toUPDATE 1', toUpdate)
  //   toUpdate.forEach((c) => {
  //     c[attribute] = Number(value);
  //   });
  //   console.log('toUPDATE 2', toUpdate)
  //   await toUpdate.save();
  //   res.send("Personajes actualizados");
  // } catch (error) {
  //   res.status(404).json(error.message);
  // }

  const toUpdate = await Character.update(
    { [attribute]: value },
    {
      where: {
        [attribute]: {
          [Op.eq]: null,
        },
      },
    }
  );
  //await toUpdate.save(); POR QUE NO NECESITE .SAVE()????y ademas me lo rompe?
  res.send("Personajes actualizados");
});

module.exports = router;
