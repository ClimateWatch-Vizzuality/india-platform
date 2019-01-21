class CreateClimateFinances < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_finances do |t|
      t.string :source, null: false
      t.integer :year, null: false
      t.float :value, null: false
      t.string :unit, null: false

      t.timestamps
    end
  end
end
