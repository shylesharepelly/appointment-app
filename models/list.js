'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    
    static addappointment( title, starttime,endtime,duration) {
      return this.create({ title: title, start:starttime,end:endtime,duration:duration});
    }
    
    static getlist()
    {
      return this.findAll({
        order: [
          ['start', 'ASC'],
      ],
      });
    }


  }
  List.init({
    title: DataTypes.STRING,
    start: DataTypes.TIME,
    end: DataTypes.TIME,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};