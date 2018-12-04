class CreateClimatePolicies < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policies do |t|
      t.string :category, null: false
      t.string :code, null: false
      t.string :policy_type, null: false
      t.text :title, null: false
      t.text :authority
      t.text :description
      t.boolean :tracking
      t.text :tracking_description
    end
  end
end
