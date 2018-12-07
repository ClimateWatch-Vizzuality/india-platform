class RenameClimatePoliciesToClimatePolicyPolicies < ActiveRecord::Migration[5.2]
  def change
    rename_table :climate_policies, :climate_policy_policies
  end
end
