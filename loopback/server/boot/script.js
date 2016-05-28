module.exports = function(app) {
    var MongoDB = app.dataSources.MongoDB;

    MongoDB.automigrate('Customer', function(err) {
        if (err) {console.log("automigrate"); throw (err);}
        var Customer = app.models.Customer;

        Customer.create([
            {username: 'Admin', email: 'larry@towanda.com', password: 'xyzzy', userId: 0, 'admin': true},
        ], function(err, users) {
            if (err) {console.log("Customer.create"); throw (err);}
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;

            // Create the admin role.
            Role.create(
                {name: 'admin'},
                function(err, role) {
                    if (err) {console.log("Customer.create"); throw (err);}
                    // Make admin.
                    role.principals.create({
                        principalType: RoleMapping.USER,
                        principalId  : users[0].id,
                    }, function(err, principal) {
                        if (err) {console.log("role.principals.create"); throw (err);}
                    });
                });
        });
    });
};
