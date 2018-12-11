class AddStatusProgressAndKeyPolicyToClimatePolicies < ActiveRecord::Migration[5.2]
  def change
    add_column :climate_policy_policies, :status, :string
    add_column :climate_policy_policies, :progress, :string
    add_column :climate_policy_policies, :key_policy, :boolean, null: false, default: false
  end
end
