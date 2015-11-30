var currentSchemaVersion = 1;

exports.currentSchemaVersion = currentSchemaVersion;
exports.upgradeSchema = upgradeSchema;
exports.downgradeSchema = downgradeSchema;

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
	}

    user.schema_version = currentSchemaVersion;
    user.save();
}

/** Handles downgrade schema migrations */
function downgradeSchema(user) {
    user.schema_version = currentSchemaVersion;
    user.save();
}
