class CreateClimatePolicyMilestones < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_milestones do |t|
      t.references :policy,
                   foreign_key: {
                     to_table: :climate_policy_policies,
                     on_delete: :cascade
                   },
                   index: true

      t.string :name
      t.text :responsible_authority
      t.string :date
      t.string :status
      t.text :data_source_link

      t.timestamps
    end
  end
end
