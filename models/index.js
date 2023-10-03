import dbConfigs from "../config/dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";
import userModel from './users.js';
import assignmentModel from "./assignments.js";
import csvParser from "csv-parser";
import fs from 'fs';
import bcrypt from 'bcryptjs';
const sequelize= new Sequelize(
    dbConfigs.DB,
    dbConfigs.USER, 
    dbConfigs.PASSWORD,
    {
        host:dbConfigs.HOST,
        port:dbConfigs.PORT, 
        dialect:dbConfigs.dialect,
        operatorsAliases:false,
        pool:dbConfigs.pool
    }
);


sequelize.authenticate().then(()=>{
    console.log("Connected to the database")
}).catch(err=>{
    console.error("Error while connecting to the db", err)
})

const db={};
db.Sequelize= Sequelize
db.sequelize=sequelize;
db.users= userModel(sequelize,DataTypes)

db.assignments= assignmentModel(sequelize,DataTypes)

db.users.hasMany(db.assignments,{foreignKey:{name :"createdBy"},onDelete:"CASCADE",field:"id",allowNull:false})
db.users.hasMany(db.assignments,{foreignKey:{name :"updatedBy"},onDelete:"CASCADE",field:"id",allowNull:false})
//ensure that the created date is never updated 
db.users.beforeUpdate((instance,option)=>{
    delete instance.dataValues.account_created;
    instance.dataValues.account_updated= Sequelize.literal('CURRENT_TIMESTAMP');

});

db.sequelize.sync({force:false,alter:false}).then(()=> {

    const userCSVFile=new URL('./users.csv', import.meta.url);
    fs.createReadStream(userCSVFile)
        .pipe(csvParser()) 
        .on('data',async (data)=>{
            // load the data into the database
            const userInfo={...data};
            const salt = await bcrypt.genSalt(10);
            userInfo.password= await bcrypt.hash(data.password,salt);

            //performing an upsert to check if the user is already in the database
            db.users.upsert(userInfo); 
        }); 
}).catch(err=>console.log("error resync app",err));

export default db;

