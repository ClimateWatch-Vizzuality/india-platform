class CreateClimatePolicyProgressRecords < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_progress_records do |t|
      t.references :indicator,
                   foreign_key: {
                     to_table: :climate_policy_indicators,
                     on_delete: :cascade
                   }
      t.string :axis_x
      t.string :category
      t.string :value, null: false
      t.string :target

      t.timestamps
    end
  end
end
