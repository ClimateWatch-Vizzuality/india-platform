class ClimatePolicyIndicatorChanges < ActiveRecord::Migration[5.2]
  def change
    change_table(:climate_policy_indicators) do |t|
      t.rename :value, :unit

      t.string :code
      t.string :progress_display
      t.float :target_numeric
      t.string :target_text
      t.string :target_year
    end

    add_index :climate_policy_indicators, :code, unique: true
  end
end
