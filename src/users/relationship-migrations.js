var currentSchemaVersion = 1;

exports.currentSchemaVersion = currentSchemaVersion;
exports.handleMigrations = handleMigrations;

function handleMigrations(next) {
  var relationship = this;

  if (!relationship.schema_version) {
    relationship.schema_version = 0;
  }

  if (relationship.schema_version < currentSchemaVersion) {
    upgradeSchema(relationship);
  } else if (relationship.schema_version > currentSchemaVersion) {
    downgradeSchema(relationship);
  }

  relationship.save(next);
}

/**
 * Handles upgrade shcema migrations.
 * @param {Object} object representing the outdated user
 */
function upgradeSchema(relationship) {
  relationship.schema_version = currentSchemaVersion;
}

/** Handles downgrade schema migrations */
function downgradeSchema(relationship) {
}
