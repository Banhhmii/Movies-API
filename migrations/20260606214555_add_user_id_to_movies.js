/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table("Movies", function(table) {
    table.integer("user_id").unsigned().references("id").inTable("Users").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table("Movies", function(table) {
    table.dropForeign("user_id");
    table.dropColumn("user_id");
  });
};
