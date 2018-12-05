class AddUniqueIndexOnCodeToClimatePolicies < ActiveRecord::Migration[5.2]
  def change
    add_index :climate_policies, :code, unique: true
  end
end
