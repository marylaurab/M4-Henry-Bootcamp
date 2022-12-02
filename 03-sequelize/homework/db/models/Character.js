const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Character",
    {
      code: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
        validate:{
          isNotHenry(value) {
            if(value.toLowerCase()==='henry') throw Error('error')
          }
        }
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notIn:['Henry', 'SoyHenry', 'Soy Henry']
        }
      },
      age: {
        type: DataTypes.INTEGER,
        get() {
          if(this.getDataValue('age')===null) return null;
          return this.getDataValue('age')+ ' years old'
        } //No me sirve el .concat()
      },
      race: {
        type: DataTypes.ENUM(
          "Human",
          "Elf",
          "Machine",
          "Demon",
          "Animal",
          "Other"
        ),
        defaultValue: "Other",
      },
      hp: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      mana: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_added: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
    },
    { timestamps: false }
  );
};
