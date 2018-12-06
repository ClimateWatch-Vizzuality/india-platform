class CreateClimatePolicyInstruments < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_instruments do |t|
      t.references :policy,
                   foreign_key: {
                     to_table: :climate_policy_policies,
                     on_delete: :cascade
                   },
                   index: true
      t.string :code, null: false
      t.string :name, null: false
      t.string :policy_scheme
      t.text :description
      t.text :scheme
      t.text :policy_status
      t.text :key_milestones
      t.text :implementation_entities
      t.text :broader_context
      t.text :source
    end

    add_index :climate_policy_instruments, :code, unique: true
  end
end
