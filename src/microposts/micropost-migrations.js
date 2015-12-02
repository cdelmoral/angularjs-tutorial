var currentSchemaVersion = 0;

exports.currentSchemaVersion = currentSchemaVersion;
exports.upgradeSchema = upgradeSchema;
exports.downgradeSchema = downgradeSchema;

/**
 * Handles upgrade shcema migrations.
 * @param  {Object} object representing the outdated micropost
 */
function upgradeSchema(micropost) {
	switch (micropost.schema_version) {
		case 0:
	}

    micropost.schema_version = currentSchemaVersion;
    micropost.save();
}

/** Handles downgrade schema migrations. */
function downgradeSchema(micropost) {
    micropost.schema_version = currentSchemaVersion;
    micropost.save();
}
