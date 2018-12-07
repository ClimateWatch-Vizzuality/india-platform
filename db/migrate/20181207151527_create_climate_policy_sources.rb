class CreateClimatePolicySources < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_sources do |t|
      t.string :code, null: false
      t.string :name
      t.string :description
      t.text :link

      t.timestamps
    end

    add_index :climate_policy_sources, :code, unique: true
  end
end
