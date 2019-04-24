class CreateClimatePolicyPoliciesSources < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_policies_sources do |t|
      t.references :source, foreign_key: {to_table: :climate_policy_sources, on_delete: :cascade}
      t.references :policy, foreign_key: {to_table: :climate_policy_policies, on_delete: :cascade}
    end
  end
end
