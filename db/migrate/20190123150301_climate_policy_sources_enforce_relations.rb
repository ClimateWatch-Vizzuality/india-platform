class ClimatePolicySourcesEnforceRelations < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_instruments_sources do |t|
      t.references :source, foreign_key: {to_table: :climate_policy_sources, on_delete: :cascade}
      t.references :instrument, foreign_key: {to_table: :climate_policy_instruments, on_delete: :cascade}
    end
    create_table :climate_policy_indicators_sources do |t|
      t.references :source, foreign_key: {to_table: :climate_policy_sources, on_delete: :cascade}
      t.references :indicator, foreign_key: {to_table: :climate_policy_indicators, on_delete: :cascade}
    end

    remove_column :climate_policy_instruments, :source, :text
    remove_column :climate_policy_indicators, :sources, :text
    remove_column :climate_policy_indicators, :data_source_link, :text

    remove_column :climate_policy_milestones, :data_source_link, :text
    add_reference :climate_policy_milestones, :source, foreign_key: {
                    to_table: :climate_policy_sources,
                    on_delete: :cascade
                  }, index: true
  end
end
