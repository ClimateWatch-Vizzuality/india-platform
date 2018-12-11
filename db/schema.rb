# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_12_11_085948) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "climate_policy_indicators", force: :cascade do |t|
    t.bigint "policy_id"
    t.string "category"
    t.text "name"
    t.string "value"
    t.string "attainment_date"
    t.text "responsible_authority"
    t.text "data_source_link"
    t.string "tracking_frequency"
    t.text "tracking_notes"
    t.text "status"
    t.text "sources"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["policy_id"], name: "index_climate_policy_indicators_on_policy_id"
  end

  create_table "climate_policy_instruments", force: :cascade do |t|
    t.bigint "policy_id"
    t.string "code", null: false
    t.string "name", null: false
    t.string "policy_scheme"
    t.text "description"
    t.text "scheme"
    t.text "policy_status"
    t.text "key_milestones"
    t.text "implementation_entities"
    t.text "broader_context"
    t.text "source"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_climate_policy_instruments_on_code", unique: true
    t.index ["policy_id"], name: "index_climate_policy_instruments_on_policy_id"
  end

  create_table "climate_policy_milestones", force: :cascade do |t|
    t.bigint "policy_id"
    t.string "name"
    t.text "responsible_authority"
    t.string "date"
    t.string "status"
    t.text "data_source_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["policy_id"], name: "index_climate_policy_milestones_on_policy_id"
  end

  create_table "climate_policy_policies", force: :cascade do |t|
    t.string "sector", null: false
    t.string "code", null: false
    t.string "policy_type", null: false
    t.text "title", null: false
    t.text "authority"
    t.text "description"
    t.boolean "tracking"
    t.text "tracking_description"
    t.string "status"
    t.string "progress"
    t.boolean "key_policy", default: false, null: false
    t.index ["code"], name: "index_climate_policy_policies_on_code", unique: true
  end

  create_table "climate_policy_sources", force: :cascade do |t|
    t.string "code", null: false
    t.string "name"
    t.string "description"
    t.text "link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_climate_policy_sources_on_code", unique: true
  end

  create_table "datasets", force: :cascade do |t|
    t.string "name"
    t.bigint "section_id"
    t.index ["section_id", "name"], name: "datasets_section_id_name_key", unique: true
    t.index ["section_id"], name: "index_datasets_on_section_id"
  end

  create_table "historical_emissions_data_sources", force: :cascade do |t|
    t.text "name"
    t.text "display_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "historical_emissions_gases", force: :cascade do |t|
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "historical_emissions_gwps", force: :cascade do |t|
    t.text "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "historical_emissions_records", force: :cascade do |t|
    t.bigint "location_id"
    t.bigint "data_source_id"
    t.bigint "sector_id"
    t.bigint "gas_id"
    t.bigint "gwp_id"
    t.jsonb "emissions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["data_source_id"], name: "index_historical_emissions_records_on_data_source_id"
    t.index ["gas_id"], name: "index_historical_emissions_records_on_gas_id"
    t.index ["gwp_id"], name: "index_historical_emissions_records_on_gwp_id"
    t.index ["location_id"], name: "index_historical_emissions_records_on_location_id"
    t.index ["sector_id"], name: "index_historical_emissions_records_on_sector_id"
  end

  create_table "historical_emissions_sectors", force: :cascade do |t|
    t.bigint "parent_id"
    t.bigint "data_source_id"
    t.text "name"
    t.text "annex_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["data_source_id"], name: "index_historical_emissions_sectors_on_data_source_id"
    t.index ["parent_id"], name: "index_historical_emissions_sectors_on_parent_id"
  end

  create_table "location_members", force: :cascade do |t|
    t.bigint "location_id"
    t.bigint "member_id"
    t.index ["location_id"], name: "index_location_members_on_location_id"
    t.index ["member_id"], name: "index_location_members_on_member_id"
  end

  create_table "locations", force: :cascade do |t|
    t.text "iso_code3", null: false
    t.text "iso_code2", null: false
    t.text "location_type", null: false
    t.text "wri_standard_name", null: false
    t.boolean "show_in_cw", default: true, null: false
    t.text "pik_name"
    t.text "cait_name"
    t.text "ndcp_navigators_name"
    t.text "unfccc_group"
    t.json "topojson"
    t.jsonb "centroid"
  end

  create_table "platforms", force: :cascade do |t|
    t.string "name"
    t.index ["name"], name: "platforms_name_key", unique: true
  end

  create_table "sections", force: :cascade do |t|
    t.string "name"
    t.bigint "platform_id"
    t.index ["platform_id", "name"], name: "sections_platform_id_name_key", unique: true
    t.index ["platform_id"], name: "index_sections_on_platform_id"
  end

  create_table "worker_logs", force: :cascade do |t|
    t.integer "state"
    t.string "jid"
    t.bigint "section_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_email"
    t.jsonb "details", default: {}
    t.index ["jid"], name: "index_worker_logs_on_jid"
    t.index ["section_id"], name: "index_worker_logs_on_section_id"
  end

  add_foreign_key "climate_policy_indicators", "climate_policy_policies", column: "policy_id", on_delete: :cascade
  add_foreign_key "climate_policy_instruments", "climate_policy_policies", column: "policy_id", on_delete: :cascade
  add_foreign_key "climate_policy_milestones", "climate_policy_policies", column: "policy_id", on_delete: :cascade
  add_foreign_key "datasets", "sections"
  add_foreign_key "historical_emissions_records", "historical_emissions_data_sources", column: "data_source_id", on_delete: :cascade
  add_foreign_key "historical_emissions_records", "historical_emissions_gases", column: "gas_id", on_delete: :cascade
  add_foreign_key "historical_emissions_records", "historical_emissions_gwps", column: "gwp_id", on_delete: :cascade
  add_foreign_key "historical_emissions_records", "historical_emissions_sectors", column: "sector_id", on_delete: :cascade
  add_foreign_key "historical_emissions_records", "locations", on_delete: :cascade
  add_foreign_key "historical_emissions_sectors", "historical_emissions_data_sources", column: "data_source_id", on_delete: :cascade
  add_foreign_key "historical_emissions_sectors", "historical_emissions_sectors", column: "parent_id", on_delete: :cascade
  add_foreign_key "location_members", "locations", column: "member_id", on_delete: :cascade
  add_foreign_key "location_members", "locations", on_delete: :cascade
  add_foreign_key "sections", "platforms"
  add_foreign_key "worker_logs", "sections"
end
