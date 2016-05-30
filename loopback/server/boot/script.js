module.exports = function(app) {
    var MongoDB = app.dataSources.MongoDB;

    MongoDB.autoupdate('Customer', function(err) {
        if (err) {console.log("autoupdate"); throw (err);}
        var Customer = app.models.Customer;

        Customer.findOrCreate(
            {where: {username: 'Admin'}},
            {username: 'Admin', email: 'larry@towanda.com', password: 'xyzzy', userId: 0, 'admin': true},
            function(err, users) {
                if (err) {console.log("Customer.create"); throw (err);}
                var Role = app.models.Role;
                var RoleMapping = app.models.RoleMapping;

                // Create the admin role.
                Role.findOrCreate(
                    {where: {name: 'admin'}},
                    {name: 'admin'},
                    function(err, role, created) {
                        if (err) {console.log("Customer.create"); throw (err);}
                        if (created) {
                            // Make admin.
                            role.principals.create(
                                {
                                    principalType: RoleMapping.USER,
                                    principalId  : users.id,
                                }, function(err, principal) {
                                    if (err) {console.log("role.principals.create"); throw (err);}
                                });
                        }
                    });
            });
    });
};
