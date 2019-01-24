class AddCodeToClimatePolicyIndicators < ActiveRecord::Migration[5.2]
  def change
    add_column :climate_policy_indicators, :code, :string
    add_index :climate_policy_indicators, :code, unique: true
  end
end
