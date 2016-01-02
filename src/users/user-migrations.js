var Micropost = require('../microposts/micropost-model');

var currentSchemaVersion = 3;

exports.currentSchemaVersion = currentSchemaVersion;
exports.handleMigrations = handleMigrations;

function handleMigrations(user) {
    if (!user.schema_version) {
        user.schema_version = 0;
    }

    if (user.schema_version < currentSchemaVersion) {
        upgradeSchema(user);
    } else if (user.schema_version > currentSchemaVersion) {
        downgradeSchema(user);
    }
}

/**
 * Handles upgrade shcema migrations.
 * @param  {Object} object representing the outdated user
 */
function upgradeSchema(user) {
	switch (user.schema_version) {
		case 0:
			user.admin = false;
		case 1:
			user.activated = true;
			user.activated_at = new Date(0);
		case 2:
			Micropost.getMicropostsCountForUser(user._id).then(function(count) {
				user.microposts_count = count;
			});
	}

    user.schema_version = currentSchemaVersion;
    user.save();
}

/** Handles downgrade schema migrations */
function downgradeSchema(user) {
    user.schema_version = currentSchemaVersion;
    user.save();
}
