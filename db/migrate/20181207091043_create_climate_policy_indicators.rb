class CreateClimatePolicyIndicators < ActiveRecord::Migration[5.2]
  def change
    create_table :climate_policy_indicators do |t|
      t.references :policy,
                   foreign_key: {
                     to_table: :climate_policy_policies,
                     on_delete: :cascade
                   },
                   index: true
      t.string :category
      t.text :name
      t.string :value
      t.string :attainment_date
      t.text :responsible_authority
      t.text :data_source_link
      t.string :tracking_frequency
      t.text :tracking_notes
      t.text :status
      t.text :sources

      t.timestamps
    end
  end
end
