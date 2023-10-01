
export default (sequelize, DataTypes) => {

    const User = sequelize.define("user", {
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validator: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,

        }
    }, {
        timestamps: true,
        createdAt: 'account_created',
        updatedAt: 'account_updated'
    })

    return User;
}